// Dolar Binance p2p Widget v1.0.0
// Author: @ann0nip
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const params = args.widgetParameter ? args.widgetParameter.split(',') : [];
const isDarkTheme = params?.[0] === 'dark';
const padding = 3;

const widget = new ListWidget();
widget.url = 'http://p2p.binance.com/en/trade/sell/USDT?fiat=ARS&payment=ALL';
widget.backgroundColor = Color.darkGray();
widget.setPadding(padding, padding, padding, padding);

const headerStack = widget.addStack();

addCenteredDataView(headerStack, 'Dólar Binance P2P', 16, Color.orange());

async function buildWidget() {
    const tetherPriceInfo = await getTokenPriceInfo();

    const roundedTetherBidPrice = Math.round(tetherPriceInfo.compra * 100)/100;
    const roundedTetherAskPrice = Math.round(tetherPriceInfo.venta * 100)/100;

    addCrypto('Compra', roundedTetherBidPrice, tetherPriceInfo.yesterdayBid);
    addCrypto('Venta', roundedTetherAskPrice, tetherPriceInfo.yesterdayAsk);

    const footerStack = widget.addStack();

    const event = new Date(tetherPriceInfo.time);
    const options = { timeStyle: 'medium', dateStyle: 'short' };
    const date = event.toLocaleString('es-AR', options);

    addCenteredDataView(footerStack, date, 12, Color.lightGray());
}

function addCenteredDataView(widget, data, textSize, textColor) {
    const viewStack = widget.addStack();
    viewStack.layoutHorizontally();

    viewStack.addSpacer();

    const label = viewStack.addText(data);
    label.font = Font.regularMonospacedSystemFont(textSize);
    label.textColor = textColor || Color.white();

    viewStack.addSpacer();
}

function addCrypto(spreadText, price, grow) {
    const rowStack = widget.addStack();

    rowStack.setPadding(10, 7, 10, 7);
    rowStack.layoutHorizontally();

    let spreadLabel = rowStack.addText(spreadText);
    spreadLabel.font = Font.boldSystemFont(15);
    spreadLabel.textColor = Color.white();

    rowStack.addSpacer();
    let priceLabel = rowStack.addText(`$${price}`);
    priceLabel.font = Font.boldSystemFont(15);

    if (grow < price) {
        priceLabel.textColor = Color.green();
    } else {
        priceLabel.textColor = Color.red();
    }
}

async function getTokenPriceInfo(tokenId) {
    const url = `https://dolar-api.gabrielzim.com/rates/single/usdt/ars`;
    const req = new Request(url);
    const apiResult = await req.loadJSON();

    return {
        compra: apiResult.bid,
        yesterdayBid: apiResult.yesterdayBid,
        venta: apiResult.ask,
        yesterdayAsk: apiResult.yesterdayAsk,
        info: apiResult.description,
        time: apiResult.time,
    };
}

async function loadImage(imgUrl) {
    const req = new Request(imgUrl);
    return await req.loadImage();
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
