import { LitElement, html, css, customElement, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import "./similarity-tab.element.js";
import "./unused-properties-tab.element.js";
import "./composition-tab.element.js";
import "./naming-tab.element.js";

type TabId = "similarity" | "unused" | "composition" | "naming";

@customElement("doctypedoctor-analysis-dashboard")
export class AnalysisDashboardElement extends UmbElementMixin(LitElement) {
  @state() private _activeTab: TabId = "similarity";

  private _tabs: Array<{ id: TabId; label: string; icon: string }> = [
    { id: "similarity", label: "Similarity", icon: "icon-merge" },
    { id: "unused", label: "Unused Properties", icon: "icon-trash" },
    { id: "composition", label: "Composition Chains", icon: "icon-link" },
    { id: "naming", label: "Naming Issues", icon: "icon-alert" },
  ];

  render() {
    return html`
      <uui-tab-group>
        ${this._tabs.map(tab => html`
          <uui-tab
            label=${tab.label}
            ?active=${this._activeTab === tab.id}
            @click=${() => this._activeTab = tab.id}
          >
            <uui-icon slot="icon" name=${tab.icon}></uui-icon>
            ${tab.label}
          </uui-tab>
        `)}
      </uui-tab-group>

      <div class="tab-content">
        ${this._activeTab === "similarity" ? html`<doctypedoctor-similarity-tab></doctypedoctor-similarity-tab>` : ""}
        ${this._activeTab === "unused" ? html`<doctypedoctor-unused-properties-tab></doctypedoctor-unused-properties-tab>` : ""}
        ${this._activeTab === "composition" ? html`<doctypedoctor-composition-tab></doctypedoctor-composition-tab>` : ""}
        ${this._activeTab === "naming" ? html`<doctypedoctor-naming-tab></doctypedoctor-naming-tab>` : ""}
      </div>
    `;
  }

  static styles = css`
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
}

export default AnalysisDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    "doctypedoctor-analysis-dashboard": AnalysisDashboardElement;
  }
}
