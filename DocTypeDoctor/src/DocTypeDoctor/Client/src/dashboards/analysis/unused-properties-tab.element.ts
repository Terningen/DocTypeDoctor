import { LitElement, html, css, customElement, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { DOCTYPEDOCTOR_API_BASE } from "../../constants.js";

interface UnusedPropertyResult {
  docTypeId: string;
  docTypeName: string;
  docTypeAlias: string;
  propertyAlias: string;
  propertyName: string;
  dataTypeName: string;
  totalNodes: number;
  usageCount: number;
}

@customElement("doctypedoctor-unused-properties-tab")
export class UnusedPropertiesTabElement extends UmbElementMixin(LitElement) {
  @state() private _results: UnusedPropertyResult[] = [];
  @state() private _loading: boolean = false;
  @state() private _filterDocType: string = "";

  async connectedCallback() {
    super.connectedCallback();
    await this._fetchResults();
  }

  private async _fetchResults() {
    this._loading = true;
    try {
      const response = await fetch(`${DOCTYPEDOCTOR_API_BASE}/analysis/unused-properties`);
      if (response.ok) {
        this._results = await response.json();
      }
    } finally {
      this._loading = false;
    }
  }

  private get _filteredResults() {
    if (!this._filterDocType) return this._results;
    return this._results.filter(r =>
      r.docTypeName.toLowerCase().includes(this._filterDocType.toLowerCase())
    );
  }

  render() {
    const filtered = this._filteredResults;
    return html`
      <uui-box>
        <p class="description">Properties that exist on a document type but have never been filled in on any content node.</p>
        <div class="controls">
          <uui-input
            placeholder="Filter by document type..."
            .value=${this._filterDocType}
            @input=${(e: InputEvent) => this._filterDocType = (e.target as HTMLInputElement).value}
          ></uui-input>
          <uui-button look="secondary" @click=${this._fetchResults} ?disabled=${this._loading}>
            ${this._loading ? html`<uui-loader-circle></uui-loader-circle>` : "Refresh"}
          </uui-button>
        </div>
        <p class="summary">Found <strong>${filtered.length}</strong> unused properties</p>

        ${filtered.length === 0
          ? html`<p class="empty">${this._loading ? "Loading..." : "No unused properties found. Your model is clean!"}</p>`
          : html`
          <uui-table>
            <uui-table-head>
              <uui-table-head-cell>Document Type</uui-table-head-cell>
              <uui-table-head-cell>Property</uui-table-head-cell>
              <uui-table-head-cell>Data Type</uui-table-head-cell>
              <uui-table-head-cell>Nodes</uui-table-head-cell>
            </uui-table-head>
            ${filtered.map(r => html`
              <uui-table-row>
                <uui-table-cell>
                  <strong>${r.docTypeName}</strong><br/>
                  <small>${r.docTypeAlias}</small>
                </uui-table-cell>
                <uui-table-cell>
                  <strong>${r.propertyName}</strong><br/>
                  <small>${r.propertyAlias}</small>
                </uui-table-cell>
                <uui-table-cell><uui-tag look="secondary">${r.dataTypeName}</uui-tag></uui-table-cell>
                <uui-table-cell>
                  <span title="${r.totalNodes} nodes, ${r.usageCount} filled">
                    0 / ${r.totalNodes}
                  </span>
                </uui-table-cell>
              </uui-table-row>
            `)}
          </uui-table>`}
      </uui-box>
    `;
  }

  static styles = css`
    :host { display: block; }
    .description { color: var(--uui-color-text-alt); margin-top: 0; }
    .controls { display: flex; gap: var(--uui-size-space-4); margin-bottom: var(--uui-size-space-4); flex-wrap: wrap; }
    .summary { color: var(--uui-color-text-alt); margin: 0 0 var(--uui-size-space-4); }
    .empty { color: var(--uui-color-text-alt); font-style: italic; }
  `;
}

export default UnusedPropertiesTabElement;

declare global {
  interface HTMLElementTagNameMap {
    "doctypedoctor-unused-properties-tab": UnusedPropertiesTabElement;
  }
}
