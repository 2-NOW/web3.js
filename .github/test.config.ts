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

type Account = {
	address: string;
	privateKey: string;
	balance: string;
};

export const accounts: Account[] = [
	{
		address: '0xdc6bad79dab7ea733098f66f6c6f9dd008da3258',
		privateKey: '0x4c3758228f536f7a210f8936182fb5b728046970b8e3215d0b5cb4c4faae8a4e',
		balance: '100',
	},
	{
		address: '0x962f9a9c2a6c092474d24def35eccb3d9363265e',
		privateKey: '0x34aeb1f338c17e6b440c189655c89fcef148893a24a7f15c0cb666d9cf5eacb3',
		balance: '100',
	},
	{
		// ganache account for personal tests
		address: '0x1337C75FdF978ABABaACC038A1dCd580FeC28ab2',
		privateKey: '0x6a56d57b7d8ba43929e84234c576587bbb2526a57b3e3823b0c97065767985fc',
		balance: '100',
	},
	{
		// geth account for personal tests
		address: '0x420ab031E4EbCD4E7f0C198D344dd954Df1ca4b9',
		privateKey: '9e0c4d12677882ddf99775ce67305206c08e8db25f49902316771e5d0d27c08a',
		balance: '100',
	},
];
export const clientUrl = 'http://localhost:8545';
export const clientWsUrl = 'ws://localhost:8545';
