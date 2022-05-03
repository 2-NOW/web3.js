/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
import WebSocketProvider from 'web3-providers-ws';
import { SupportedProviders } from 'web3-core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Contract, decodeEventABI } from 'web3-eth-contract';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbiEventFragment } from 'web3-eth-abi';
import { Web3Eth } from '../../src';
import { basicContractAbi, basicContractByteCode } from '../shared_fixtures/sources/Basic';
// eslint-disable-next-line import/no-relative-packages
import { accounts, clientWsUrl } from '../../../../.github/test.config';
import { prepareNetwork, setupWeb3, Resolve } from './helper';
import { LogsSubscription } from '../../src/web3_subscriptions';

const checkEventCount = 3;

const eventAbi: AbiEventFragment = basicContractAbi.find((e: any) => {
	return e.name === 'StringEvent' && (e as AbiEventFragment).type === 'event';
})! as AbiEventFragment;
type MakeFewTxToContract = {
	sendOptions: Record<string, unknown>;
	contract: Contract<typeof basicContractAbi>;
	testDataString: string;
};
const makeFewTxToContract = async ({
	contract,
	sendOptions,
	testDataString,
}: MakeFewTxToContract): Promise<void> => {
	const prs = [];
	for (let i = 0; i < checkEventCount; i += 1) {
		prs.push(contract.methods?.firesStringEvent(testDataString).send(sendOptions));
	}
	await Promise.all(prs);
};
describe('subscription', () => {
	let web3Eth: Web3Eth;
	let providerWs: WebSocketProvider;
	let contract: Contract<typeof basicContractAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;
	let from: string;
	const testDataString = 'someTestString';
	beforeAll(async () => {
		from = accounts[0].address;
		await prepareNetwork();
		providerWs = new WebSocketProvider(
			clientWsUrl,
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
		contract = new Contract(basicContractAbi, undefined, {
			provider: clientWsUrl,
		});

		deployOptions = {
			data: basicContractByteCode,
			arguments: [10, 'string init value'],
		};

		sendOptions = { from, gas: '1000000' };

		contract = await contract.deploy(deployOptions).send(sendOptions);
	});
	afterAll(() => {
		providerWs.disconnect();
	});

	describe('logs', () => {
		it(`wait for ${checkEventCount} logs`, async () => {
			web3Eth = new Web3Eth(providerWs as SupportedProviders<any>);
			setupWeb3(web3Eth);

			const sub: LogsSubscription = await web3Eth.subscribe('logs', {
				address: contract.options.address,
			});

			let count = 0;

			const pr = new Promise((resolve: Resolve) => {
				sub.on('data', async (data: any) => {
					count += 1;
					const decodedData = decodeEventABI(
						eventAbi as AbiEventFragment & { signature: string },
						data,
					);
					expect(decodedData.returnValue['0']).toBe(testDataString);
					if (count >= checkEventCount) {
						resolve();
					}
				});
			});

			await makeFewTxToContract({ contract, sendOptions, testDataString });

			await pr;
			await web3Eth.clearSubscriptions();
		});
		it(`wait for ${checkEventCount} logs with from block`, async () => {
			web3Eth = new Web3Eth(providerWs as SupportedProviders<any>);
			setupWeb3(web3Eth);
			const fromBlock = await web3Eth.getTransactionCount(String(contract.options.address));

			await makeFewTxToContract({ contract, sendOptions, testDataString });

			const sub: LogsSubscription = await web3Eth.subscribe('logs', {
				fromBlock,
				address: contract.options.address,
			});

			let count = 0;

			const pr = new Promise((resolve: Resolve) => {
				sub.on('data', async (data: any) => {
					count += 1;
					const decodedData = decodeEventABI(
						eventAbi as AbiEventFragment & { signature: string },
						data,
					);
					expect(decodedData.returnValue['0']).toBe(testDataString);
					if (count >= checkEventCount) {
						resolve();
					}
				});
			});

			await pr;
			await web3Eth.clearSubscriptions();
		});
		it(`clear`, async () => {
			web3Eth = new Web3Eth(providerWs as SupportedProviders<any>);
			setupWeb3(web3Eth);
			const sub: LogsSubscription = await web3Eth.subscribe('logs');
			expect(sub.id).toBeDefined();
			await web3Eth.clearSubscriptions();
			expect(sub.id).toBeUndefined();
		});
	});
});