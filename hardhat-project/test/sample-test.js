const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');


let accounts;
describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    //LIBRARIES
    const NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
    const nftDescriptor = await NFTDescriptor.deploy();
    const nftDescriptorContract = await nftDescriptor.deployed();

    const MultiPartRLEToSVG = await ethers.getContractFactory("MultiPartRLEToSVG");
    const multiPartRLEToSVG = await MultiPartRLEToSVG.deploy();
    const multiPartContract = await multiPartRLEToSVG.deployed();

    //Contracts
    const NounsDescriptor = await ethers.getContractFactory("NounsDescriptor", {
      libraries: {
        NFTDescriptor: nftDescriptorContract.address,
      },
    });
    const nounsDescriptor = await NounsDescriptor.deploy();
    const nounsDescriptorContract = await nounsDescriptor.deployed();
    const nounsDescriptorObj = await NounsDescriptor.attach(nounsDescriptorContract.address);

    const NounsSeeder = await ethers.getContractFactory("NounsSeeder");
    const nounsSeeder = await NounsSeeder.deploy();
    const nounsSeederContract = await nounsSeeder.deployed();
    const nounsSeederObj = await NounsSeeder.attach(nounsSeederContract.address);

    accounts = await ethers.getSigners();
    const owner = accounts[0];
    const dao  = accounts[1];
    const buyer = accounts[2];

    const NounsToken = await ethers.getContractFactory("NounsToken");
    const nounsToken = await NounsToken.connect(buyer).deploy(dao.address, buyer.address, nounsDescriptor.address, nounsSeeder.address, {
      gasLimit: 30000000
    })
    const nounsTokenContract = await nounsToken.deployed();


    //RUN TESTS
    await nounsDescriptor.addManyColorsToPalette(0, ['#000000', '#50646f', '#3c4a54', '#768e96', '#5d707b', 
                        '#4f5967', '#1b2531', '#40565d', '#2c3540', '#393b48', '#131825', '#0a0f19', '#c2d8df',
                            '#608295', '#28292d', '#6a7b83', '#acb5c0', '#bfc8cf', '#a6ccdb', '#5b6168', 
                                '#1e2420', '#474c4d', '#2a2019', '#76828d', '#898d93', '#0a0b0d', 
                                      '#98a2a9', '#474442', '#1c1513', '#cae3eb', '#3f3c34', '#9fb7c5', 
                                            '#697377', '#343427', '#788fb0', '#8592a1', '#60584b', '#2a2409', 
                                                    '#221000', '#21333e', '#483a22', '#5d6f6f']);
    
    // const head = ethers.utils.toUtf8Bytes('');
    // const head0 = ethers.utils.toUtf8Bytes('');
    // console.log(head0);
    var text = fs.readFileSync("/Users/jessejacob/Documents/projects/NYC-NFT-Creator/bytesCode.txt",'utf8')
    const bytes = ethers.utils.toUtf8Bytes(text);
    
    await nounsDescriptor.addHead(bytes);




    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});


