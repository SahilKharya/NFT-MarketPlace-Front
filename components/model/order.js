import Model from "~/components/model/model"
import app from "~/plugins/app"
import BigNumber from "~/plugins/bignumber"
import Web3 from "web3"
import { parseBalance, toTokenAmount } from "~/plugins/helpers/token-utils"

const ZERO = new BigNumber(0)
const TEN = new BigNumber(10)

export default class Order extends Model {
  get categories_id() {
    return this.categories.id
  }
  get erc20tokens_id() {
    return this.erc20tokens.id
  }

  get token() {
    let img = ""
    let name = `Token ${this.tokens_id}`
    let owner = ""
    let description = ""
    if (this.image) {
      img = this.image
    }
    if (this.name) {
      name = this.name
    }
    if (this.description) {
      description = this.description
    }

    if (this.seller_users) owner = this.seller_users.address
    else if (this.makerAddress) owner = this.makerAddress
    else owner = ""

    return {
      name: name,
      img_url: img,
      owner: owner,
      description: description,
      attributes_metadata: this.attributes,
    }
  }

  getPrice() {
    const price = new BigNumber(this.price)
    const erc20Token = app.vuexStore.getters['token/erc20Tokens'].find(token => token.id == this.erc20tokens_id)
    if (!price || !erc20Token) {
      return ZERO
    }
    return parseBalance(price, erc20Token.decimal)
  }

  getMinPrice() {
    const price = new BigNumber(this.min_price)
    if (!price) {
      return ZERO
    }

    const erc20Token = app.vuexStore.getters['token/erc20Tokens'].find(token => token.id == this.erc20tokens_id)
    return parseBalance(price, erc20Token.decimal)
  }

  getPriceInBN() {
    const erc20Token = app.vuexStore.getters['token/erc20Tokens'].find(token => token.id == this.erc20tokens_id)
    if (!this.price || !erc20Token) {
      return ZERO
    }
    return toTokenAmount(this.price, erc20Token.decimal)
  }

  getMinPriceInBN() {
    if (!this.min_price) {
      return ZERO
    }
    const erc20Token = app.vuexStore.getters['token/erc20Tokens'].find(token => token.id == this.erc20tokens_id)
    return toTokenAmount(this.min_price, erc20Token.decimal)
  }

}
