// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.34;

import { Ownable, Ownable2Step } from "@openzeppelin-contracts-5/access/Ownable2Step.sol";
import { SafeERC20, IERC20 } from "@openzeppelin-contracts-5/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PaymentManager
 * @notice SmardexAI Payment Manager contract
 */
contract PaymentManager is Ownable2Step {
    using SafeERC20 for IERC20;

    /// @notice The ERC20 token used for payments
    IERC20 internal immutable TOKEN;

    /// @notice Duration of each session slot in seconds
    uint256 internal _sessionDuration;
    /// @notice Price per session slot in token units
    uint256 internal _sessionPrice;

    /// @notice User credit balances
    mapping(address => uint256) internal _balanceOf;
    /// @notice User session expiration timestamps
    mapping(address => uint256) internal _sessionExpiry;

    /**
     * @notice Emitted when credits are purchased
     * @param account User account that received credits
     * @param amount Amount of tokens burned
     */
    event CreditsPurchased(address indexed account, uint256 amount);
    /**
     * @notice Emitted when a session is extended
     * @param account User account with extended session
     * @param expiration New session expiration timestamp
     */
    event SessionExtended(address indexed account, uint256 expiration);
    /// @notice Emitted when session duration is updated by owner
    event SessionDurationUpdated(uint256 newSessionDuration);
    /// @notice Emitted when session price is updated by owner
    event SessionPriceUpdated(uint256 newSessionPrice);
    /**
     * @notice Emitted when a user's session expiration is manually set by owner
     * @param account User account with updated session
     * @param newExpiration New session expiration timestamp
     */
    event SessionExpirationUpdated(address indexed account, uint256 newExpiration);
    /**
     * @notice Emitted when a user's balance is manually set by owner
     * @param account User account with updated balance
     * @param newBalance New balance amount
     */
    event BalanceUpdated(address indexed account, uint256 newBalance);

    /// @notice Thrown when an amount is zero
    error PaymentManagerZeroAmount();
    /// @notice Thrown when an address is zero
    error PaymentManagerZeroAddress();

    /**
     * @notice Initializes the PaymentManager contract
     * @param initialOwner Address that will own the contract
     * @param tokenAddress Address of the ERC20 token used for payments
     * @param initialSessionDuration Duration of each session slot in seconds
     * @param initialSessionPrice Price per session slot in token units
     */
    constructor(address initialOwner, address tokenAddress, uint256 initialSessionDuration, uint256 initialSessionPrice)
        Ownable(initialOwner)
    {
        require(tokenAddress != address(0), PaymentManagerZeroAddress());
        require(initialSessionDuration > 0, PaymentManagerZeroAmount());
        require(initialSessionPrice > 0, PaymentManagerZeroAmount());
        TOKEN = IERC20(tokenAddress);
        _sessionDuration = initialSessionDuration;
        _sessionPrice = initialSessionPrice;
        emit SessionDurationUpdated(initialSessionDuration);
        emit SessionPriceUpdated(initialSessionPrice);
    }

    /**
     * @notice Buy AI chat credits by burning tokens for a specific account
     * @param to Account to credit
     * @param amount Amount of tokens to burn
     */
    function buyCredits(address to, uint256 amount) external {
        require(amount > 0, PaymentManagerZeroAmount());
        require(to != address(0), PaymentManagerZeroAddress());

        TOKEN.safeTransferFrom(msg.sender, address(0xdead), amount);

        _balanceOf[to] += amount;

        emit CreditsPurchased(to, amount);
    }

    /**
     * @notice Extend AI terminal session by burning tokens for a specific account
     * @param to Account to extend session for
     * @param slotCount Number of session slots to extend
     * @dev If session is active, extends from current expiry; otherwise starts from block.timestamp
     */
    function extendSession(address to, uint256 slotCount) external {
        require(slotCount > 0, PaymentManagerZeroAmount());
        require(to != address(0), PaymentManagerZeroAddress());

        uint256 amount = slotCount * _sessionPrice;

        TOKEN.safeTransferFrom(msg.sender, address(0xdead), amount);

        uint256 currentExpiry = _sessionExpiry[to];
        uint256 baseTime = (currentExpiry > block.timestamp) ? currentExpiry : block.timestamp;
        uint256 newExpiry = baseTime + slotCount * _sessionDuration;
        _sessionExpiry[to] = newExpiry;

        emit SessionExtended(to, newExpiry);
    }

    /* ========== ADMIN FUNCTIONS ========== */

    /**
     * @notice Update session duration
     * @param newSessionDuration New session duration in seconds
     */
    function setSessionDuration(uint256 newSessionDuration) external onlyOwner {
        require(newSessionDuration > 0, PaymentManagerZeroAmount());
        _sessionDuration = newSessionDuration;
        emit SessionDurationUpdated(newSessionDuration);
    }

    /**
     * @notice Update session price
     * @param newSessionPrice New session price in tokens
     */
    function setSessionPrice(uint256 newSessionPrice) external onlyOwner {
        require(newSessionPrice > 0, PaymentManagerZeroAmount());
        _sessionPrice = newSessionPrice;
        emit SessionPriceUpdated(newSessionPrice);
    }

    /**
     * @notice Manually set session expiration for an account
     * @param to Account address
     * @param expiration New session expiration timestamp
     */
    function setSessionExpiration(address to, uint256 expiration) external onlyOwner {
        require(to != address(0), PaymentManagerZeroAddress());
        _sessionExpiry[to] = expiration;
        emit SessionExpirationUpdated(to, expiration);
    }

    /**
     * @notice Manually set balance for an account
     * @param to Account address
     * @param balance New balance amount
     */
    function setBalanceOf(address to, uint256 balance) external onlyOwner {
        require(to != address(0), PaymentManagerZeroAddress());
        _balanceOf[to] = balance;
        emit BalanceUpdated(to, balance);
    }

    /* ========== VIEW FUNCTIONS ========== */

    /// @notice Get current session duration in seconds
    function getSessionDuration() external view returns (uint256 sessionDuration_) {
        sessionDuration_ = _sessionDuration;
    }

    /// @notice Get current session price
    function getSessionPrice() external view returns (uint256 sessionPrice_) {
        sessionPrice_ = _sessionPrice;
    }

    /// @notice Get the ERC20 token used for payments
    function getToken() external view returns (IERC20 token_) {
        token_ = TOKEN;
    }

    /**
     * @notice Get account session expiration timestamp
     * @param account Account address
     */
    function getSessionExpiry(address account) external view returns (uint256 sessionExpiry_) {
        sessionExpiry_ = _sessionExpiry[account];
    }

    /**
     * @notice Get account balance
     * @param account Account address
     */
    function balanceOf(address account) external view returns (uint256 balance_) {
        balance_ = _balanceOf[account];
    }
}
