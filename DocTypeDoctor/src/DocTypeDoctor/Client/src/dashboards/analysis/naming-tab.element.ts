import { LitElement, html, css, customElement, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { DOCTYPEDOCTOR_API_BASE } from "../../constants.js";

interface PropertyReference {
  docTypeId: string;
  docTypeName: string;
  propertyAlias: string;
  propertyName: string;
}

interface PropertyNamingIssue {
  issueType: string;
  description: string;
  properties: PropertyReference[];
  suggestedStandard: string;
}

@customElement("doctypedoctor-naming-tab")
export class NamingTabElement extends UmbElementMixin(LitElement) {
  @state() private _results: PropertyNamingIssue[] = [];
  @state() private _loading: boolean = false;

  async connectedCallback() {
    super.connectedCallback();
    await this._fetchResults();
  }

  private async _fetchResults() {
    this._loading = true;
    try {
      const response = await fetch(`${DOCTYPEDOCTOR_API_BASE}/analysis/naming-issues`);
      if (response.ok) {
        this._results = await response.json();
      }
    } finally {
      this._loading = false;
    }
  }

  render() {
    return html`
      <uui-box>
        <p class="description">Properties with the same semantic meaning but different naming formats across document types.</p>
        <div class="controls">
          <uui-button look="secondary" @click=${this._fetchResults} ?disabled=${this._loading}>
            ${this._loading ? html`<uui-loader-circle></uui-loader-circle>` : "Refresh"}
          </uui-button>
        </div>
        <p class="summary">Found <strong>${this._results.length}</strong> naming inconsistencies</p>

        ${this._results.length === 0
          ? html`<p class="empty">${this._loading ? "Loading..." : "No naming inconsistencies found!"}</p>`
          : this._results.map(issue => html`
            <div class="issue">
              <div class="issue-header">
                <strong>${issue.issueType}:</strong> <span>${issue.description}</span>
              </div>
              <div class="issue-header">
                <strong>Suggested standard:</strong> <code>${issue.suggestedStandard}</code>
              </div>
              <uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Document Type</uui-table-head-cell>
                  <uui-table-head-cell>Property Alias</uui-table-head-cell>
                  <uui-table-head-cell>Property Name</uui-table-head-cell>
                </uui-table-head>
                ${issue.properties.map(p => html`
                  <uui-table-row>
                    <uui-table-cell>${p.docTypeName}</uui-table-cell>
                    <uui-table-cell><code>${p.propertyAlias}</code></uui-table-cell>
                    <uui-table-cell>${p.propertyName}</uui-table-cell>
                  </uui-table-row>
                `)}
              </uui-table>
            </div>
          `)}
      </uui-box>
    `;
  }

  static styles = css`
    :host { display: block; }
    .description { color: var(--uui-color-text-alt); margin-top: 0; }
    .controls { display: flex; gap: var(--uui-size-space-4); margin-bottom: var(--uui-size-space-4); }
    .summary { color: var(--uui-color-text-alt); margin: 0 0 var(--uui-size-space-4); }
    .empty { color: var(--uui-color-text-alt); font-style: italic; }
    .issue { margin-bottom: var(--uui-size-space-6); padding: var(--uui-size-space-4); border: 1px solid var(--uui-color-border); border-radius: var(--uui-border-radius); }
    .issue-header { display: flex; align-items: center; gap: var(--uui-size-space-3); margin-bottom: var(--uui-size-space-3); }
    .issue-suggestion { display: flex; align-items: center; gap: var(--uui-size-space-3); margin-bottom: var(--uui-size-space-3); }
    code { background: var(--uui-color-surface-alt); padding: 2px 6px; border-radius: 3px; font-family: monospace; }
  `;
}

export default NamingTabElement;

declare global {
  interface HTMLElementTagNameMap {
    "doctypedoctor-naming-tab": NamingTabElement;
  }
}
