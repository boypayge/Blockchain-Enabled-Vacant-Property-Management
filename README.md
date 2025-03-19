# Blockchain-Enabled Vacant Property Management

A decentralized platform for tracking, managing, and revitalizing vacant properties within urban communities.

## Overview

This system leverages blockchain technology to create a transparent, secure, and efficient framework for managing vacant properties. By recording property data on a distributed ledger, we enable collaboration between property owners, community organizations, local governments, and developers to transform unused spaces into community assets.

## Core Smart Contracts

### Property Registration Contract

The foundation of our system, recording essential details about vacant buildings and lots:

- Property identification and geolocation data
- Ownership information and contact details
- Property classification (residential, commercial, industrial)
- Historical ownership and usage records
- Legal status and zoning information
- Tax assessment and payment history

### Condition Assessment Contract

Continuously tracks and verifies the structural integrity and safety aspects of vacant properties:

- Structural assessment reports
- Safety hazard identification
- Maintenance history and scheduled inspections
- Compliance with local building codes
- Environmental risk factors
- Utility connection status

### Temporary Use Contract

Facilitates and manages short-term community utilization of vacant spaces:

- Application and approval workflow for temporary uses
- Usage terms, conditions, and time limitations
- Insurance and liability documentation
- User reputation and feedback system
- Resource allocation for community projects
- Event scheduling and space availability calendar

### Redevelopment Tracking Contract

Monitors progress toward permanent use and redevelopment:

- Development proposals and approval status
- Project milestones and completion targets
- Funding sources and financial tracking
- Contractor information and performance metrics
- Permit application status
- Community input and stakeholder engagement

## Key Features

- **Decentralized Property Registry**: Immutable record of property ownership and status
- **Automated Compliance Monitoring**: Smart contracts that enforce regulatory requirements
- **Community Engagement Tools**: Voting mechanisms for community input on potential uses
- **Transparent Redevelopment Tracking**: Public visibility into project progress and timelines
- **Incentive Systems**: Token-based rewards for property improvement and community involvement
- **Data Analytics Dashboard**: Visualization of vacancy trends and redevelopment impact

## Benefits

- **For Property Owners**: Reduced liability, potential income from temporary uses, simplified compliance
- **For Local Government**: Improved data quality, reduced administrative burden, increased tax base
- **For Community Members**: Greater access to spaces, input on neighborhood development, improved safety
- **For Developers**: Streamlined property acquisition, reduced due diligence costs, community support

## Getting Started

### Prerequisites

- Ethereum wallet with test ETH (for development)
- Node.js and npm installed
- Truffle Suite for contract development and testing
- MetaMask or similar wallet extension for browser interaction

### Installation

```bash
# Clone the repository
git clone https://github.com/your-organization/blockchain-vacant-property.git

# Install dependencies
cd blockchain-vacant-property
npm install

# Compile smart contracts
truffle compile

# Deploy to local test network
truffle migrate --network development
```

### Configuration

1. Create a `.env` file based on the provided `.env.example`
2. Configure your preferred Ethereum network in `truffle-config.js`
3. Update the property registration parameters in `config/parameters.js`

## Usage Examples

### Registering a Vacant Property

```javascript
const PropertyRegistry = artifacts.require("PropertyRegistry");

module.exports = async function(callback) {
  const registry = await PropertyRegistry.deployed();
  
  await registry.registerProperty(
    "123 Main Street",
    "0x123456789abcdef...", // Owner's wallet address
    "residential",
    "42.3601,-71.0589", // Geolocation
    "vacant building",
    { from: accounts[0] }
  );
  
  callback();
};
```

### Scheduling a Temporary Use

```javascript
const TemporaryUseContract = artifacts.require("TemporaryUseContract");

module.exports = async function(callback) {
  const tempUse = await TemporaryUseContract.deployed();
  
  await tempUse.proposeTemporaryUse(
    propertyId,
    "Community Garden",
    1612137600, // Start timestamp
    1643673600, // End timestamp
    "Weekly community gardening program with educational workshops",
    { from: communityOrgAddress }
  );
  
  callback();
};
```

## Contributing

We welcome contributions from developers, urban planners, community organizers, and property management professionals. Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract templates
- [Truffle Suite](https://www.trufflesuite.com/) for development tools
- [FOAM](https://foam.space/) for geospatial registry inspiration
- [Local municipalities] for data sharing and regulatory guidance
