const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

//ganache network port 8545
const web3 = new Web3(new Web3.providers.HttpProvider(
    "http://localhost:8545"));

const { interface, bytecode } = require('../compile');
console.log(interface);
console.log(bytecode);

let accounts;
let inbox;

//https://rinkeby.infura.io/v3/632513845170486091ade20ac4eaf410

beforeEach(async () => {
    // Get a List of all accounts
    accounts = await web3.eth.getAccounts();

    //Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface)).
        deploy({ data: bytecode, arguments: ['Hi there'] }).
        send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi there');
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('bye')
            .send({ from: accounts[0], gas: '1000000' });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });

});
