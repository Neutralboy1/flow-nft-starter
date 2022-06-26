export const mintNFT = `
// REPLACE THIS WITH YOUR CONTRACT NAME + ADDRESS
import BottomShotUpgrade from 0x3e5c4324fbfb06ac

// Do not change these
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

transaction(
  recipient: Address,
  name: String,
  description: String,
  thumbnail: String,
) {
  prepare(signer: AuthAccount) {
    if signer.borrow<&BottomShotUpgrade.Collection>(from: BottomShotUpgrade.CollectionStoragePath) != nil {
      return
    }

    // Create a new empty collection
    let collection <- BottomShotUpgrade.createEmptyCollection()

    // save it to the account
    signer.save(<-collection, to: BottomShotUpgrade.CollectionStoragePath)

    // create a public capability for the collection
    signer.link<&{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
      BottomShotUpgrade.CollectionPublicPath,
      target: BottomShotUpgrade.CollectionStoragePath
    )
  }


  execute {
    // Borrow the recipient's public NFT collection reference
    let receiver = getAccount(recipient)
      .getCapability(BottomShotUpgrade.CollectionPublicPath)
      .borrow<&{NonFungibleToken.CollectionPublic}>()
      ?? panic("Could not get receiver reference to the NFT Collection")

    // Mint the NFT and deposit it to the recipient's collection
    BottomShotUpgrade.mintNFT(
      recipient: receiver,
      name: name,
      description: description,
      thumbnail: thumbnail,
    )
    
    log("Minted an NFT and stored it into the collection")
  } 
}
`;
