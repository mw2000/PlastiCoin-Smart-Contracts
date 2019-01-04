pragma solidity ^0.4.23;

contract ERC20 {
    uint public totalSupply;
    function balanceOf(address who) public view returns (uint);
    function allowance(address owner, address spender) public view returns (uint);

    function transfer(address to, uint value) public returns (bool ok);
    function transferFrom(address from, address to, uint value) public returns (bool ok);
    function approve(address spender, uint value) public returns (bool ok);

    //ERC 621 Functions
    function increaseSupply(uint value, address to) public returns (bool);
    function decreaseSupply(uint value, address from) public returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}