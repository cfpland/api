export const weeklyMjmlTemplate = `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-size="16px" color="dimgray" font-family="Helvetica" align="left" />
      <mj-body background-color="#ffffff"></mj-body>
      <mj-section padding="10px"></mj-section>
      <mj-text padding="5px 0"></mj-text>
      <mj-divider padding="10px 15px" border-width="1px" border-style="dashed" border-color="lightgrey"></mj-divider>
    </mj-attributes>
    <mj-style>
      @media screen and (min-width: 480px) {
      .tags div {
      text-align: right !important;
      }
      }
    </mj-style>
    <mj-style inline="inline">
      a {
      color: #F7468A;
      text-decoration: underline;
      }
      p {
      line-height: 11px;
      }
      .category-tag {
      background-color: #67597A;
      font-size: 12px;
      padding: 5px;
      color: #ffffff;
      border-radius: 5px;
      font-weight: bold;
      text-decoration: none;
      }
      .new-tag {
      background-color: #998fc7;
      font-size: 12px;
      padding: 5px;
      color: #ffffff;
      border-radius: 5px;
      font-weight: bold;
      }
      .see-more-cta {
      display: block; 
      text-decoration: none; 
      background-color: #998FC7;
      padding: 20px; 
      color: #ffffff; 
      font-weight: bold; 
      border-radius: 5px;
      }
    </mj-style>
  </mj-head>
  <mj-body>
    <!-- Header -->
    <mj-section>
      <mj-column>
        <mj-image href="https://www.cfpland.com/" align="center" src="https://drive.google.com/uc?id=1kdzltxyMtycKo-RO_08d-PJcKx4GFdh_" alt="CFP Land Weekly Update" padding-bottom="20px"></mj-image>
      </mj-column>
    </mj-section>
    
    <!-- Sponsor: Draft -->
    <mj-section background-color="#e0ebf9" border-bottom="1px dashed lightgrey">
      <mj-column width="30%">
        <mj-image align="center" href="https://draft.dev/#playbook" src="https://drive.google.com/uc?id=16RIxm_7SPVUKISfkMYr2Rr7oAfKWvlwG"></mj-image>
      </mj-column>
      <mj-column width="70%">
        <mj-text font-weight="bold" line-height="24px">
          <a href="https://draft.dev/#playbook">Managing a Technical Blog?</a>
        </mj-text>
        <mj-text color="#666666" font-size="16px" line-height="20px">
          <em>The Technical Content Manager’s Playbook</em> by Draft.dev is a collection of resources you can use to produce high-quality, technical blog content. <strong>If you're managing writers, a publishing calendar, or creating a style guide, this playbook is for you.</strong>
        </mj-text>
        <mj-text>
          <a href="https://draft.dev/#playbook">Download Free →</a>
        </mj-text>
        <mj-text align="right" font-size="12px" font-style="italic">Sponsor</mj-text>
      </mj-column>
    </mj-section>

    {{#if conferences.items.0.preferred}}
    <!-- Feed Divider -->
    <mj-section>
      <mj-column>
        <mj-text font-size="24px" padding-top="10px">⭐️ Preferred CFPs:</mj-text>
        <mj-text font-style="italic" color="#8d8d8d">
          Based on
          <a style="color:#8d8d8d;text-decoration:underline;"
            clicktracking=off
            href="{{ subscriber.profileLink }}"
          >your preferences</a>.
        </mj-text>
      </mj-column>
    </mj-section>
    {{#each conferences.items}}{{#if this.preferred}}
    <!-- CFP -->
    <mj-section border-bottom="1px dashed lightgrey">
      <mj-column>
        <mj-text line-height="22px">
          <a href="{{this.cfp_url}}">{{this.name}}</a>
        </mj-text>
        <mj-text color="#666666" font-size="14px" line-height="20px">
          <p title="CFP Due Date">
            <strong>Due:</strong> {{date this.cfp_due_date "LL"}}
          </p>
          <p title="Conference Date">
            <strong>Conference Date:</strong> {{date this.event_start_date "LL"}}
          </p>
          <p title="location">
            <strong>Location: </strong>{{this.location}}
          </p>
        </mj-text>
      </mj-column>
      <mj-column>
        <mj-text css-class="tags" align="left">
          {{#if this.is_new}}
          <span title="Added in the past 7 days" class="new-tag">🔔 &nbsp;New</span>
          {{/if}}
          <a href="https://www.cfpland.com/conferences/{{lowercase this.category}}" class="category-tag">#{{this.category}}</a>
        </mj-text>
      </mj-column>
    </mj-section>
    {{/if}}{{/each}}
    
    <!-- Sponsor: Draft - none this week -->

    {{/if}}
    
    <!-- Feed Divider -->
    <mj-section>
      <mj-column>
        <mj-text font-size="24px" padding-top="10px">📅 All CFPs:</mj-text>
        <mj-text font-style="italic" color="#8d8d8d">
          View even more at <a style="color:#8d8d8d;text-decoration:underline;"
           href="https://www.cfpland.com/conferences"
           >www.cfpland.com</a>
        </mj-text>
      </mj-column>
    </mj-section>
    {{#each (first conferences.items 15)}}{{#unless this.preferred}}
    <!-- CFP -->
    <mj-section border-bottom="1px dashed lightgrey">
      <mj-column>
        <mj-text line-height="22px">
          <a href="{{this.cfp_url}}">{{this.name}}</a>
        </mj-text>
        <mj-text color="#666666" font-size="14px" line-height="20px">
          <p title="CFP Due Date">
            <strong>Due:</strong> {{date this.cfp_due_date "LL"}}
          </p>
          <p title="Conference Date">
            <strong>Conference Date:</strong> {{date this.event_start_date "LL"}}
          </p>
          <p title="location">
            <strong>Location: </strong>{{this.location}}
          </p>
        </mj-text>
      </mj-column>
      <mj-column>
        <mj-text css-class="tags" align="left">
          {{#if this.is_new}}
          <span title="Added in the past 7 days" class="new-tag">🔔 &nbsp;New</span>
          {{/if}}
          <a href="https://www.cfpland.com/conferences/{{lowercase this.category}}" class="category-tag">#{{this.category}}</a>
        </mj-text>
      </mj-column>
    </mj-section>
    {{/unless}}{{/each}}
    
    {{#gt conferences.items.length 15}}
    <!-- See More -->
    <mj-section>
      <mj-column>
        <mj-text align="center" padding="20px">
          <p>{{ subtract conferences.items.length 15 }} more conferences have CFPs closing in the next month...</p>
          <a class="see-more-cta" href="https://www.cfpland.com/conferences">
            Click Here to See Them All
          </a>
        </mj-text>
      </mj-column>
    </mj-section>
    {{/gt}}

    <!-- Outro -->
    <mj-section>
      <mj-column>
        <mj-text align="center" font-size="14px" padding-bottom="50px">
            <a clicktracking=off href="{{ subscriber.profileLink }}">Preferences</a> |
            <a href="https://www.cfpland.com/submit">Submit a Conference</a> |
            <a href="https://sponsor.cfpland.com/">Sponsor</a> |
            <a clicktracking=off href="https://www.cfpland.com/members/">CFP Land Pro</a>
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section full-width="full-width" background-color="#ececec" css-class="footer" padding-bottom="30px" padding-top="30px">
      <mj-column>
        <mj-text align="center" font-size="12px" line-height="16px">
          No longer interested in receiving this email?
          <a clicktracking=off href="{{ subscriber.unsubscribeLink }}">Unsubscribe</a> or
          <a clicktracking=off href="{{ subscriber.profileLink }}">update your preferences</a>.
          <br/>
          © 2020, <a href="https://www.cfpland.com">CFP Land</a>.
          Created by <a href="https://www.portablecto.com">Portable CTO, LLC</a>.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
