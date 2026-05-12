import { LitElement, html, css, customElement, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { DOCTYPEDOCTOR_API_BASE } from "../../constants.js";

interface CompositionChainResult {
  docTypeId: string;
  docTypeName: string;
  docTypeAlias: string;
  depth: number;
  compositionPath: string[];
  hasCircularReference: boolean;
  severity: string;
}

@customElement("doctypedoctor-composition-tab")
export class CompositionTabElement extends UmbElementMixin(LitElement) {
  @state() private _results: CompositionChainResult[] = [];
  @state() private _loading: boolean = false;
  @state() private _depthThreshold: number = 4;

  async connectedCallback() {
    super.connectedCallback();
    await this._fetchResults();
  }

  private async _fetchResults() {
    this._loading = true;
    try {
      const response = await fetch(`${DOCTYPEDOCTOR_API_BASE}/analysis/composition-chains?depthThreshold=${this._depthThreshold}`);
      if (response.ok) {
        this._results = await response.json();
      }
    } finally {
      this._loading = false;
    }
  }

  private _getSeverityColor(severity: string): string {
    if (severity === "High") return "danger";
    if (severity === "Medium") return "warning";
    return "default";
  }

  render() {
    return html`
      <uui-box>
        <p class="description">Document types with deep composition chains can be hard to maintain. Consider flattening chains deeper than 4 levels.</p>
        <div class="controls">
          <label>Min Depth: <strong>${this._depthThreshold}</strong></label>
          <input
            type="range" min="2" max="10" step="1"
            .value=${String(this._depthThreshold)}
            @input=${(e: Event) => this._depthThreshold = Number((e.target as HTMLInputElement).value)}
            @change=${this._fetchResults}
          />
          <uui-button look="secondary" @click=${this._fetchResults} ?disabled=${this._loading}>
            ${this._loading ? html`<uui-loader-circle></uui-loader-circle>` : "Refresh"}
          </uui-button>
        </div>
        <p class="summary">Found <strong>${this._results.length}</strong> document types with depth ≥${this._depthThreshold}</p>

        ${this._results.length === 0
          ? html`<p class="empty">No deep composition chains found.</p>`
          : html`
          <uui-table>
            <uui-table-head>
              <uui-table-head-cell>Document Type</uui-table-head-cell>
              <uui-table-head-cell>Depth</uui-table-head-cell>
              <uui-table-head-cell>Severity</uui-table-head-cell>
              <uui-table-head-cell>Composition Path</uui-table-head-cell>
            </uui-table-head>
            ${this._results.map(r => html`
              <uui-table-row>
                <uui-table-cell>
                  <strong>${r.docTypeName}</strong><br/>
                  <small>${r.docTypeAlias}</small>
                  ${r.hasCircularReference ? html`<uui-tag color="danger">Circular!</uui-tag>` : ""}
                </uui-table-cell>
                <uui-table-cell><strong>${r.depth}</strong></uui-table-cell>
                <uui-table-cell>
                  <uui-tag color=${this._getSeverityColor(r.severity)}>${r.severity}</uui-tag>
                </uui-table-cell>
                <uui-table-cell>
                  <div class="path">${r.compositionPath.join(" → ")}</div>
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
    .controls { display: flex; align-items: center; gap: var(--uui-size-space-4); margin-bottom: var(--uui-size-space-4); flex-wrap: wrap; }
    input[type="range"] { 
      width: 160px;
      accent-color: #0082c8;
    }
    .summary { color: var(--uui-color-text-alt); margin: 0 0 var(--uui-size-space-4); }
    .empty { color: var(--uui-color-text-alt); font-style: italic; }
    .path { font-family: monospace; font-size: 0.85em; color: var(--uui-color-text-alt); }
  `;
}

export default CompositionTabElement;

declare global {
  interface HTMLElementTagNameMap {
    "doctypedoctor-composition-tab": CompositionTabElement;
  }
}
