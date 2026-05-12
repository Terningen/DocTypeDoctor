import { LitElement, html, css, customElement, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { DOCTYPEDOCTOR_API_BASE } from "../../constants.js";

interface SimilarityResult {
  docType1Id: string;
  docType1Name: string;
  docType1Alias: string;
  docType2Id: string;
  docType2Name: string;
  docType2Alias: string;
  similarityScore: number;
  matchingProperties: string[];
  differingProperties: string[];
  recommendation: string;
}

@customElement("doctypedoctor-similarity-tab")
export class SimilarityTabElement extends UmbElementMixin(LitElement) {
  @state() private _results: SimilarityResult[] = [];
  @state() private _threshold: number = 70;
  @state() private _loading: boolean = false;
  @state() private _expanded: string | null = null;
  @state() private _error: string | null = null;

  async connectedCallback() {
    super.connectedCallback();
    await this._fetchResults();
  }

  private async _fetchResults() {
    this._loading = true;
    this._error = null;
    try {
      const response = await fetch(`${DOCTYPEDOCTOR_API_BASE}/analysis/similarity?threshold=${this._threshold}`);
      if (response.ok) {
        this._results = await response.json();
      } else {
        const errorText = await response.text();
        this._error = `API Error (${response.status}): ${errorText}`;
      }
    } catch (error) {
      this._error = `Network Error: ${error}`;
    } finally {
      this._loading = false;
    }
  }

  private _onThresholdChange(e: Event) {
    this._threshold = Number((e.target as HTMLInputElement).value);
  }

  private async _onThresholdCommit() {
    await this._fetchResults();
  }

  private _toggleExpand(key: string) {
    this._expanded = this._expanded === key ? null : key;
  }

  private _getSeverityColor(score: number): string {
    if (score >= 90) return "danger";
    if (score >= 75) return "warning";
    return "positive";
  }

  render() {
    return html`
      <uui-box>
        <div class="controls">
          <label>Similarity Threshold: <strong>${this._threshold}%</strong></label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            .value=${String(this._threshold)}
            @input=${this._onThresholdChange}
            @change=${this._onThresholdCommit}
          />
          <uui-button look="secondary" @click=${this._fetchResults} ?disabled=${this._loading}>
            ${this._loading ? html`<uui-loader-circle></uui-loader-circle>` : "Refresh"}
          </uui-button>
        </div>
        <p class="summary">
          Found <strong>${this._results.length}</strong> pairs with ≥${this._threshold}% similarity
        </p>

        ${this._error ? html`<p class="error">⚠️ ${this._error}</p>` : ''}

        ${this._results.length === 0 && !this._error
          ? html`<p class="empty">No similar document types found at this threshold.</p>`
          : html`
          <uui-table>
            <uui-table-head>
              <uui-table-head-cell>DocType A</uui-table-head-cell>
              <uui-table-head-cell>DocType B</uui-table-head-cell>
              <uui-table-head-cell>Similarity</uui-table-head-cell>
              <uui-table-head-cell>Recommendation</uui-table-head-cell>
              <uui-table-head-cell></uui-table-head-cell>
            </uui-table-head>
            ${this._results.map(r => {
              const key = `${r.docType1Id}-${r.docType2Id}`;
              return html`
                <uui-table-row>
                  <uui-table-cell>
                    <a href="#/section/settings/document-type/edit/${r.docType1Id}" class="doc-type-link">
                      <strong>${r.docType1Name}</strong><br/>
                      <small>${r.docType1Alias}</small>
                    </a>
                  </uui-table-cell>
                  <uui-table-cell>
                    <a href="#/section/settings/document-type/edit/${r.docType2Id}" class="doc-type-link">
                      <strong>${r.docType2Name}</strong><br/>
                      <small>${r.docType2Alias}</small>
                    </a>
                  </uui-table-cell>
                  <uui-table-cell class="badge-cell">
                    <uui-tag color=${this._getSeverityColor(r.similarityScore)}>
                      ${r.similarityScore}%
                    </uui-tag>
                  </uui-table-cell>
                  <uui-table-cell>${r.recommendation}</uui-table-cell>
                  <uui-table-cell>
                    <uui-button look="secondary" compact @click=${() => this._toggleExpand(key)}>
                      ${this._expanded === key ? "Hide" : "Details"}
                    </uui-button>
                  </uui-table-cell>
                </uui-table-row>
                ${this._expanded === key ? html`
                  <uui-table-row class="detail-row">
                    <uui-table-cell colspan="5">
                      <div class="detail">
                        <div>
                          <strong>Matching properties (${r.matchingProperties.length}):</strong>
                          <div class="tags">${r.matchingProperties.map(p => html`<uui-tag look="secondary">${p}</uui-tag>`)}</div>
                        </div>
                        <div>
                          <strong>Differing properties (${r.differingProperties.length}):</strong>
                          <div class="tags">${r.differingProperties.map(p => html`<uui-tag look="outline">${p}</uui-tag>`)}</div>
                        </div>
                      </div>
                    </uui-table-cell>
                  </uui-table-row>` : ''}
              `;
            })}
          </uui-table>`}
      </uui-box>
    `;
  }

  static styles = css`
    :host { display: block; }
    .controls {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-4);
      margin-bottom: var(--uui-size-space-4);
      flex-wrap: wrap;
    }
    input[type="range"] { 
      width: 200px; 
      accent-color: #0082c8;
    }
    .summary { color: var(--uui-color-text-alt); margin: 0 0 var(--uui-size-space-4); }
    .empty { color: var(--uui-color-text-alt); font-style: italic; }
    .error { color: var(--uui-color-danger); background: var(--uui-color-danger-light); padding: var(--uui-size-space-3); border-radius: var(--uui-border-radius); margin-bottom: var(--uui-size-space-4); }
    .detail { display: grid; grid-template-columns: 1fr 1fr; gap: var(--uui-size-space-4); padding: var(--uui-size-space-4); }
    .tags { display: flex; flex-wrap: wrap; gap: var(--uui-size-space-2); margin-top: var(--uui-size-space-2); }
    uui-table-cell[colspan] { padding: 0; }
    .doc-type-link {
      text-decoration: none;
      color: inherit;
    }
    .doc-type-link:hover {
      text-decoration: underline;
      color: var(--uui-color-primary);
    }
    .badge-cell {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;
}

export default SimilarityTabElement;

declare global {
  interface HTMLElementTagNameMap {
    "doctypedoctor-similarity-tab": SimilarityTabElement;
  }
}
