pragma solidity ^0.4.11;

contract ERC20_Token {
    /* Constructor */
    string public name;
    string public symbol;
    uint256 public decimal;
    uint256 public totalSupply;
    address public owner;
    
    mapping(address=>uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    
    function ERC20_Token(string _name,string _symbol,uint256 _decimal,uint256 _initialSupply) public {
            name=_name;
            symbol=_symbol;
            decimal=_decimal;
            totalSupply=_initialSupply;
            owner=msg.sender;
            balances[msg.sender]=totalSupply;
    }
    
    function totalSupply() public constant returns (uint){
        return totalSupply;
    }
    function balanceOf(address tokenOwner) public constant returns (uint ){
        return balances[tokenOwner];
    }
    
    //to transfer some tokens to another Admin Account 
    function transfer(address to, uint tokens) public returns (bool success){
        balances[msg.sender] -= tokens;
        balances[to] += tokens;
        Transfer(msg.sender, to, tokens);
        return true;
    }
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] -= tokens;
        // allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] += tokens;
        Transfer(from, to, tokens);
        return true;
        }
       
        //To add extraa functionality
   
    // function approve(address spender, uint tokens) public returns (bool success) {
    //     allowed[msg.sender][spender] = tokens;
    //     Approval(msg.sender, spender, tokens);
    //     return true;
    // }
    
    // function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {
    //       return allowed[tokenOwner][spender];
    //   }
}