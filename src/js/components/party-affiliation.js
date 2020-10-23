export class PartyAffiliationBlock {
  constructor(props) {
    this.element = $(`
        <style>
            .party-affiliation {
                align-items: center;
                display: flex;
                margin-top: 12px;
                padding: 12px;
            }

            h4 {
                margin: 0;
            }

            .text-content {
                flex-basis: 80%;
            }

            .img-container {
                flex-basis: 20%;
                text-align: right;
            }

            .img-container img {
                height: auto;
                width: 28px;
            }
        </style>
        <div class="party-affiliation card">
            <div class="text-content">
                <h3 class="h3-block-title">Party Affiliation</h3>
                <h4 class="subtitle">${props.partyName} (${props.partyAbbr})</h4>
            </div>
            <div class="img-container">
                <img src="${props.partyLogo.url}" width="${props.partyLogo.width}" height="${props.partyLogo.height}" alt="${props.partyLogo.alt}" />
            </div>
        </div>
    `);
  }

  render() {
    return this.element;
  }
}
