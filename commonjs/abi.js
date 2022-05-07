const ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"blockTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Rentalio.ERC721Identifier","name":"erc721","type":"tuple"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"createERC721Listing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"key","type":"bytes"}],"name":"decodeERC721key","outputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Rentalio.ERC721Identifier","name":"","type":"tuple"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"deleteAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Rentalio.ERC721Identifier","name":"erc721","type":"tuple"}],"name":"encodeERC721key","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"erc721Records","outputs":[{"internalType":"bool","name":"paused","type":"bool"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"address","name":"rentedBy","type":"address"},{"internalType":"uint256","name":"rentalExpiration","type":"uint256"},{"internalType":"uint256","name":"erc721recordIdx","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Rentalio.ERC721Identifier","name":"erc721","type":"tuple"}],"name":"getERC721Listing","outputs":[{"components":[{"internalType":"bool","name":"paused","type":"bool"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"address","name":"rentedBy","type":"address"},{"internalType":"uint256","name":"rentalExpiration","type":"uint256"},{"internalType":"uint256","name":"erc721recordIdx","type":"uint256"}],"internalType":"struct Rentalio.ERC721Record","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getERC721Listings","outputs":[{"components":[{"internalType":"bool","name":"paused","type":"bool"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"address","name":"rentedBy","type":"address"},{"internalType":"uint256","name":"rentalExpiration","type":"uint256"},{"internalType":"uint256","name":"erc721recordIdx","type":"uint256"}],"internalType":"struct Rentalio.ERC721Record[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"getERC721RentedByAddress","outputs":[{"components":[{"internalType":"bool","name":"paused","type":"bool"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"address","name":"rentedBy","type":"address"},{"internalType":"uint256","name":"rentalExpiration","type":"uint256"},{"internalType":"uint256","name":"erc721recordIdx","type":"uint256"}],"internalType":"struct Rentalio.ERC721Record[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Rentalio.ERC721Identifier","name":"erc721","type":"tuple"}],"name":"getListingData","outputs":[{"components":[{"internalType":"bool","name":"paused","type":"bool"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"address","name":"rentedBy","type":"address"},{"internalType":"uint256","name":"rentalExpiration","type":"uint256"},{"internalType":"uint256","name":"erc721recordIdx","type":"uint256"}],"internalType":"struct Rentalio.ERC721Record","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Rentalio.ERC721Identifier[]","name":"erc721s","type":"tuple[]"}],"name":"getListingDataBatch","outputs":[{"components":[{"internalType":"bool","name":"paused","type":"bool"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"address","name":"rentedBy","type":"address"},{"internalType":"uint256","name":"rentalExpiration","type":"uint256"},{"internalType":"uint256","name":"erc721recordIdx","type":"uint256"}],"internalType":"struct Rentalio.ERC721Record[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Rentalio.ERC721Identifier","name":"erc721","type":"tuple"}],"name":"getRentalHistory","outputs":[{"components":[{"internalType":"address","name":"rentedFrom","type":"address"},{"internalType":"address","name":"rentedBy","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct Rentalio.RentalHistory[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Rentalio.ERC721Identifier","name":"erc721","type":"tuple"},{"internalType":"bool","name":"newState","type":"bool"}],"name":"pauseERC721Listing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Rentalio.ERC721Identifier","name":"erc721","type":"tuple"}],"name":"removeERC721Listing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Rentalio.ERC721Identifier","name":"erc721","type":"tuple"},{"internalType":"uint256","name":"nTimeUnits","type":"uint256"}],"name":"rentERC721","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"rentalHistory","outputs":[{"internalType":"address","name":"rentedFrom","type":"address"},{"internalType":"address","name":"rentedBy","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"rentedByAddress","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Rentalio.ERC721Identifier","name":"erc721","type":"tuple"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"setERC721ListingPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_timeUnit","type":"uint256"}],"name":"setTimeUnit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"timeUnit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]