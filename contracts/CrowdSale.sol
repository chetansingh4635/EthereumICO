pragma solidity ^0.4.11;

// Token Definition
contract ERC20_Token {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint );
    function transfer(address to, uint tokens) public returns (bool success);// to change ownership
    function transferFrom(address from, address to, uint tokens) public returns (bool success);// to supply tokens
}

// Crowdsale funding

contract CrowdSale {
    address public creator;
    address public beneficiary;
    uint256 public minFund;
    uint256 public maxFund;
    uint256 public deadLine;
    uint256 public totalBalance;
    uint256 public completedAt;
    ERC20_Token tokenReward;
    uint256 public priceInWei;
    uint256 public totalRaised;
    uint256 public currentBalance;
   
   // To store infromation of Token Buyer
    
    struct Contribution {
        uint amount;
        address contributor;
    }
    
    Contribution[] public contributions;
    
    event LogFundingReceived(address addr, uint amount, uint currentTotal);
    event LogWinnerPaid(address winnerAddress);
    event LogFundingSuccessful(uint totalRaised); 
    
    // States to check Crowdsale Status
   
    enum State {
        Fundraising,
        Failed,
        Successful,
        Closed
    }
    
    State public state = State.Fundraising; 
    
    function CrowdSale(address _creator,address _beneficiary, uint256 _minFund,uint256 _maxFund,uint256 _deadLine,ERC20_Token _tokenReward,uint256 _priceInWei) public {
        creator=_creator;
        beneficiary=_beneficiary;
        minFund=_minFund * 1 ether;   // in finney(smallest unit of ether)
        maxFund=_maxFund * 1 ether;   // in finney(smallest unit of ether)
        deadLine=now + (_deadLine * 1 minutes); // in miuntes
        tokenReward=ERC20_Token(_tokenReward);
        priceInWei= _priceInWei * 1 ether;
        currentBalance = 0;
    }
    
    // to verify the current status of crowdsale.
    
    modifier inState(State _state) {
        require(state == _state) ;
        _;
    }

    // To check Whether Bid amount is lower or not
   
     modifier isMinimum() {
        require(msg.value > priceInWei) ;
        _;
    }

// To Verify Token must not be be distributed in fractional form
    modifier inMultipleOfPrice() {
        require(msg.value%priceInWei == 0) ;
        _;
    }

// To check Admin permission
    modifier isCreator() {
        require(msg.sender == creator) ;
        _;
    }

//  Buyer Buy the Token
    function buyToken() isMinimum() inMultipleOfPrice() payable public returns(bool){
        uint256 amountInWei = msg.value;
        contributions.push(
            Contribution({
            amount:msg.value,
            contributor:msg.sender
        }));
        
        tokenReward.transferFrom(creator,msg.sender, amountInWei / priceInWei);
        LogFundingReceived(msg.sender, msg.value, totalRaised);
        totalRaised += msg.value;
        currentBalance = totalRaised;
        checkIfFundingCompleteOrExpired();
        return true;
    }

    // Checking Whether Crowdsale Completed or not
    
    function checkIfFundingCompleteOrExpired() public {
         if (totalRaised > maxFund) {
            state = State.Successful;
            LogFundingSuccessful(totalRaised);
            payOut();
            completedAt = now;
            } else if ( now > deadLine )  {
                if(totalRaised >= minFund){
                    state = State.Successful;
                    LogFundingSuccessful(totalRaised);
                    payOut();  
                    completedAt = now;
                }
                else{
                    state = State.Failed; 
                    completedAt = now;
                }
            } 
      }

      // Sending the Total Raised amount to account
     function payOut() public inState(State.Successful){
            if(!beneficiary.send(this.balance)) {
                revert();
            }
            state = State.Closed;
            currentBalance = 0;
            LogWinnerPaid(beneficiary);
        }

        //To Get Refund When ICO not Reached to Minimum Funding or ICO Fails
       
        function getRefund() public inState(State.Failed) returns (bool){
            for(uint i=0; i<=contributions.length; i++)
            {
                if(contributions[i].contributor == msg.sender){
                    uint amountToRefund = contributions[i].amount;
                    contributions[i].amount = 0;
                    if(!contributions[i].contributor.send(amountToRefund)) {
                        contributions[i].amount = amountToRefund;
                        return false;
                    }
                    else{
                        totalRaised -= amountToRefund;
                        currentBalance = totalRaised;
                    }
                    return true;
                }
            }
            return false;
        }
        
    
}