import { LitElement as g, html as a, css as m, state as u, customElement as y } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as _ } from "@umbraco-cms/backoffice/element-api";
const v = "/api/doctypedoctor/v1";
var w = Object.defineProperty, P = Object.getOwnPropertyDescriptor, p = (e, t, s, l) => {
  for (var i = l > 1 ? void 0 : l ? P(t, s) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (i = (l ? r(t, s, i) : r(i)) || i);
  return l && i && w(t, s, i), i;
};
let c = class extends _(g) {
  constructor() {
    super(...arguments), this._results = [], this._threshold = 70, this._loading = !1, this._expanded = null, this._error = null;
  }
  async connectedCallback() {
    super.connectedCallback(), await this._fetchResults();
  }
  async _fetchResults() {
    this._loading = !0, this._error = null;
    try {
      const e = await fetch(`${v}/analysis/similarity?threshold=${this._threshold}`);
      if (e.ok)
        this._results = await e.json();
      else {
        const t = await e.text();
        this._error = `API Error (${e.status}): ${t}`;
      }
    } catch (e) {
      this._error = `Network Error: ${e}`;
    } finally {
      this._loading = !1;
    }
  }
  _onThresholdChange(e) {
    this._threshold = Number(e.target.value);
  }
  async _onThresholdCommit() {
    await this._fetchResults();
  }
  _toggleExpand(e) {
    this._expanded = this._expanded === e ? null : e;
  }
  _getSeverityColor(e) {
    return e >= 90 ? "danger" : e >= 75 ? "warning" : "positive";
  }
  render() {
    return a`
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
            ${this._loading ? a`<uui-loader-circle></uui-loader-circle>` : "Refresh"}
          </uui-button>
        </div>
        <p class="summary">
          Found <strong>${this._results.length}</strong> pairs with ≥${this._threshold}% similarity
        </p>

        ${this._error ? a`<p class="error">⚠️ ${this._error}</p>` : ""}

        ${this._results.length === 0 && !this._error ? a`<p class="empty">No similar document types found at this threshold.</p>` : a`
          <uui-table>
            <uui-table-head>
              <uui-table-head-cell>DocType A</uui-table-head-cell>
              <uui-table-head-cell>DocType B</uui-table-head-cell>
              <uui-table-head-cell>Similarity</uui-table-head-cell>
              <uui-table-head-cell>Recommendation</uui-table-head-cell>
              <uui-table-head-cell></uui-table-head-cell>
            </uui-table-head>
            ${this._results.map((e) => {
      const t = `${e.docType1Id}-${e.docType2Id}`;
      return a`
                <uui-table-row>
                  <uui-table-cell>
                    <a href="#/section/settings/document-type/edit/${e.docType1Id}" class="doc-type-link">
                      <strong>${e.docType1Name}</strong><br/>
                      <small>${e.docType1Alias}</small>
                    </a>
                  </uui-table-cell>
                  <uui-table-cell>
                    <a href="#/section/settings/document-type/edit/${e.docType2Id}" class="doc-type-link">
                      <strong>${e.docType2Name}</strong><br/>
                      <small>${e.docType2Alias}</small>
                    </a>
                  </uui-table-cell>
                  <uui-table-cell class="badge-cell">
                    <uui-tag color=${this._getSeverityColor(e.similarityScore)}>
                      ${e.similarityScore}%
                    </uui-tag>
                  </uui-table-cell>
                  <uui-table-cell>${e.recommendation}</uui-table-cell>
                  <uui-table-cell>
                    <uui-button look="secondary" compact @click=${() => this._toggleExpand(t)}>
                      ${this._expanded === t ? "Hide" : "Details"}
                    </uui-button>
                  </uui-table-cell>
                </uui-table-row>
                ${this._expanded === t ? a`
                  <uui-table-row class="detail-row">
                    <uui-table-cell colspan="5">
                      <div class="detail">
                        <div>
                          <strong>Matching properties (${e.matchingProperties.length}):</strong>
                          <div class="tags">${e.matchingProperties.map((s) => a`<uui-tag look="secondary">${s}</uui-tag>`)}</div>
                        </div>
                        <div>
                          <strong>Differing properties (${e.differingProperties.length}):</strong>
                          <div class="tags">${e.differingProperties.map((s) => a`<uui-tag look="outline">${s}</uui-tag>`)}</div>
                        </div>
                      </div>
                    </uui-table-cell>
                  </uui-table-row>` : ""}
              `;
    })}
          </uui-table>`}
      </uui-box>
    `;
  }
};
c.styles = m`
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
p([
  u()
], c.prototype, "_results", 2);
p([
  u()
], c.prototype, "_threshold", 2);
p([
  u()
], c.prototype, "_loading", 2);
p([
  u()
], c.prototype, "_expanded", 2);
p([
  u()
], c.prototype, "_error", 2);
c = p([
  y("doctypedoctor-similarity-tab")
], c);
var C = Object.defineProperty, D = Object.getOwnPropertyDescriptor, f = (e, t, s, l) => {
  for (var i = l > 1 ? void 0 : l ? D(t, s) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (i = (l ? r(t, s, i) : r(i)) || i);
  return l && i && C(t, s, i), i;
};
let n = class extends _(g) {
  constructor() {
    super(...arguments), this._results = [], this._loading = !1, this._filterDocType = "";
  }
  async connectedCallback() {
    super.connectedCallback(), await this._fetchResults();
  }
  async _fetchResults() {
    this._loading = !0;
    try {
      const e = await fetch(`${v}/analysis/unused-properties`);
      e.ok && (this._results = await e.json());
    } finally {
      this._loading = !1;
    }
  }
  get _filteredResults() {
    return this._filterDocType ? this._results.filter(
      (e) => e.docTypeName.toLowerCase().includes(this._filterDocType.toLowerCase())
    ) : this._results;
  }
  render() {
    const e = this._filteredResults;
    return a`
      <uui-box>
        <p class="description">Properties that exist on a document type but have never been filled in on any content node.</p>
        <div class="controls">
          <uui-input
            placeholder="Filter by document type..."
            .value=${this._filterDocType}
            @input=${(t) => this._filterDocType = t.target.value}
          ></uui-input>
          <uui-button look="secondary" @click=${this._fetchResults} ?disabled=${this._loading}>
            ${this._loading ? a`<uui-loader-circle></uui-loader-circle>` : "Refresh"}
          </uui-button>
        </div>
        <p class="summary">Found <strong>${e.length}</strong> unused properties</p>

        ${e.length === 0 ? a`<p class="empty">${this._loading ? "Loading..." : "No unused properties found. Your model is clean!"}</p>` : a`
          <uui-table>
            <uui-table-head>
              <uui-table-head-cell>Document Type</uui-table-head-cell>
              <uui-table-head-cell>Property</uui-table-head-cell>
              <uui-table-head-cell>Data Type</uui-table-head-cell>
              <uui-table-head-cell>Nodes</uui-table-head-cell>
            </uui-table-head>
            ${e.map((t) => a`
              <uui-table-row>
                <uui-table-cell>
                  <strong>${t.docTypeName}</strong><br/>
                  <small>${t.docTypeAlias}</small>
                </uui-table-cell>
                <uui-table-cell>
                  <strong>${t.propertyName}</strong><br/>
                  <small>${t.propertyAlias}</small>
                </uui-table-cell>
                <uui-table-cell><uui-tag look="secondary">${t.dataTypeName}</uui-tag></uui-table-cell>
                <uui-table-cell>
                  <span title="${t.totalNodes} nodes, ${t.usageCount} filled">
                    0 / ${t.totalNodes}
                  </span>
                </uui-table-cell>
              </uui-table-row>
            `)}
          </uui-table>`}
      </uui-box>
    `;
  }
};
n.styles = m`
    :host { display: block; }
    .description { color: var(--uui-color-text-alt); margin-top: 0; }
    .controls { display: flex; gap: var(--uui-size-space-4); margin-bottom: var(--uui-size-space-4); flex-wrap: wrap; }
    .summary { color: var(--uui-color-text-alt); margin: 0 0 var(--uui-size-space-4); }
    .empty { color: var(--uui-color-text-alt); font-style: italic; }
  `;
f([
  u()
], n.prototype, "_results", 2);
f([
  u()
], n.prototype, "_loading", 2);
f([
  u()
], n.prototype, "_filterDocType", 2);
n = f([
  y("doctypedoctor-unused-properties-tab")
], n);
var z = Object.defineProperty, O = Object.getOwnPropertyDescriptor, $ = (e, t, s, l) => {
  for (var i = l > 1 ? void 0 : l ? O(t, s) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (i = (l ? r(t, s, i) : r(i)) || i);
  return l && i && z(t, s, i), i;
};
let d = class extends _(g) {
  constructor() {
    super(...arguments), this._results = [], this._loading = !1, this._depthThreshold = 4;
  }
  async connectedCallback() {
    super.connectedCallback(), await this._fetchResults();
  }
  async _fetchResults() {
    this._loading = !0;
    try {
      const e = await fetch(`${v}/analysis/composition-chains?depthThreshold=${this._depthThreshold}`);
      e.ok && (this._results = await e.json());
    } finally {
      this._loading = !1;
    }
  }
  _getSeverityColor(e) {
    return e === "High" ? "danger" : e === "Medium" ? "warning" : "default";
  }
  render() {
    return a`
      <uui-box>
        <p class="description">Document types with deep composition chains can be hard to maintain. Consider flattening chains deeper than 4 levels.</p>
        <div class="controls">
          <label>Min Depth: <strong>${this._depthThreshold}</strong></label>
          <input
            type="range" min="2" max="10" step="1"
            .value=${String(this._depthThreshold)}
            @input=${(e) => this._depthThreshold = Number(e.target.value)}
            @change=${this._fetchResults}
          />
          <uui-button look="secondary" @click=${this._fetchResults} ?disabled=${this._loading}>
            ${this._loading ? a`<uui-loader-circle></uui-loader-circle>` : "Refresh"}
          </uui-button>
        </div>
        <p class="summary">Found <strong>${this._results.length}</strong> document types with depth ≥${this._depthThreshold}</p>

        ${this._results.length === 0 ? a`<p class="empty">No deep composition chains found.</p>` : a`
          <uui-table>
            <uui-table-head>
              <uui-table-head-cell>Document Type</uui-table-head-cell>
              <uui-table-head-cell>Depth</uui-table-head-cell>
              <uui-table-head-cell>Severity</uui-table-head-cell>
              <uui-table-head-cell>Composition Path</uui-table-head-cell>
            </uui-table-head>
            ${this._results.map((e) => a`
              <uui-table-row>
                <uui-table-cell>
                  <strong>${e.docTypeName}</strong><br/>
                  <small>${e.docTypeAlias}</small>
                  ${e.hasCircularReference ? a`<uui-tag color="danger">Circular!</uui-tag>` : ""}
                </uui-table-cell>
                <uui-table-cell><strong>${e.depth}</strong></uui-table-cell>
                <uui-table-cell>
                  <uui-tag color=${this._getSeverityColor(e.severity)}>${e.severity}</uui-tag>
                </uui-table-cell>
                <uui-table-cell>
                  <div class="path">${e.compositionPath.join(" → ")}</div>
                </uui-table-cell>
              </uui-table-row>
            `)}
          </uui-table>`}
      </uui-box>
    `;
  }
};
d.styles = m`
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
$([
  u()
], d.prototype, "_results", 2);
$([
  u()
], d.prototype, "_loading", 2);
$([
  u()
], d.prototype, "_depthThreshold", 2);
d = $([
  y("doctypedoctor-composition-tab")
], d);
var R = Object.defineProperty, N = Object.getOwnPropertyDescriptor, x = (e, t, s, l) => {
  for (var i = l > 1 ? void 0 : l ? N(t, s) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (i = (l ? r(t, s, i) : r(i)) || i);
  return l && i && R(t, s, i), i;
};
let h = class extends _(g) {
  constructor() {
    super(...arguments), this._results = [], this._loading = !1;
  }
  async connectedCallback() {
    super.connectedCallback(), await this._fetchResults();
  }
  async _fetchResults() {
    this._loading = !0;
    try {
      const e = await fetch(`${v}/analysis/naming-issues`);
      e.ok && (this._results = await e.json());
    } finally {
      this._loading = !1;
    }
  }
  render() {
    return a`
      <uui-box>
        <p class="description">Properties with the same semantic meaning but different naming formats across document types.</p>
        <div class="controls">
          <uui-button look="secondary" @click=${this._fetchResults} ?disabled=${this._loading}>
            ${this._loading ? a`<uui-loader-circle></uui-loader-circle>` : "Refresh"}
          </uui-button>
        </div>
        <p class="summary">Found <strong>${this._results.length}</strong> naming inconsistencies</p>

        ${this._results.length === 0 ? a`<p class="empty">${this._loading ? "Loading..." : "No naming inconsistencies found!"}</p>` : this._results.map((e) => a`
            <div class="issue">
              <div class="issue-header">
                <strong>${e.issueType}:</strong> <span>${e.description}</span>
              </div>
              <div class="issue-header">
                <strong>Suggested standard:</strong> <code>${e.suggestedStandard}</code>
              </div>
              <uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Document Type</uui-table-head-cell>
                  <uui-table-head-cell>Property Alias</uui-table-head-cell>
                  <uui-table-head-cell>Property Name</uui-table-head-cell>
                </uui-table-head>
                ${e.properties.map((t) => a`
                  <uui-table-row>
                    <uui-table-cell>${t.docTypeName}</uui-table-cell>
                    <uui-table-cell><code>${t.propertyAlias}</code></uui-table-cell>
                    <uui-table-cell>${t.propertyName}</uui-table-cell>
                  </uui-table-row>
                `)}
              </uui-table>
            </div>
          `)}
      </uui-box>
    `;
  }
};
h.styles = m`
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
x([
  u()
], h.prototype, "_results", 2);
x([
  u()
], h.prototype, "_loading", 2);
h = x([
  y("doctypedoctor-naming-tab")
], h);
var j = Object.defineProperty, S = Object.getOwnPropertyDescriptor, T = (e, t, s, l) => {
  for (var i = l > 1 ? void 0 : l ? S(t, s) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (i = (l ? r(t, s, i) : r(i)) || i);
  return l && i && j(t, s, i), i;
};
let b = class extends _(g) {
  constructor() {
    super(...arguments), this._activeTab = "similarity", this._tabs = [
      { id: "similarity", label: "Similarity", icon: "icon-merge" },
      { id: "unused", label: "Unused Properties", icon: "icon-trash" },
      { id: "composition", label: "Composition Chains", icon: "icon-link" },
      { id: "naming", label: "Naming Issues", icon: "icon-alert" }
    ];
  }
  render() {
    return a`
      <uui-tab-group>
        ${this._tabs.map((e) => a`
          <uui-tab
            label=${e.label}
            ?active=${this._activeTab === e.id}
            @click=${() => this._activeTab = e.id}
          >
            <uui-icon slot="icon" name=${e.icon}></uui-icon>
            ${e.label}
          </uui-tab>
        `)}
      </uui-tab-group>

      <div class="tab-content">
        ${this._activeTab === "similarity" ? a`<doctypedoctor-similarity-tab></doctypedoctor-similarity-tab>` : ""}
        ${this._activeTab === "unused" ? a`<doctypedoctor-unused-properties-tab></doctypedoctor-unused-properties-tab>` : ""}
        ${this._activeTab === "composition" ? a`<doctypedoctor-composition-tab></doctypedoctor-composition-tab>` : ""}
        ${this._activeTab === "naming" ? a`<doctypedoctor-naming-tab></doctypedoctor-naming-tab>` : ""}
      </div>
    `;
  }
};
b.styles = m`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
    }
    .header {
      margin-bottom: var(--uui-size-layout-1);
    }
    .header-content {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-4);
    }
    .header-content h1 {
      margin: 0 0 4px;
    }
    .header-content p {
      margin: 0;
      color: var(--uui-color-text-alt);
    }
    uui-tab-group {
      background-color: white;
      border: 1px solid var(--uui-color-border);
      border-bottom: none;
      border-radius: var(--uui-border-radius) var(--uui-border-radius) 0 0;
    }
    .tab-content {
      min-height: 400px;
      border: 1px solid var(--uui-color-border);
      border-radius: 0 0 var(--uui-border-radius) var(--uui-border-radius);
    }
  `;
T([
  u()
], b.prototype, "_activeTab", 2);
b = T([
  y("doctypedoctor-analysis-dashboard")
], b);
const A = b;
export {
  b as AnalysisDashboardElement,
  A as default
};
//# sourceMappingURL=analysis-dashboard.element-I4zS6gfs.js.map
