export const weeklyUserSummaryTemplate = `<mjml>
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
      a.white-link {
      color: #FFFFFF;
      }
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
        <mj-image href="https://www.cfpland.com/" align="center" src="https://i.imgur.com/PI3keSl.png" alt="CFP Land Weekly Update" padding-bottom="20px"></mj-image>
        <mj-text line-height="0px" padding="0px">%opentracker%</mj-text>
      </mj-column>
    </mj-section>

    <!-- Intro -->
    <mj-section>
      <mj-column>
        <mj-text line-height="20px">
          Hey {{user.firstName}},
        </mj-text>
        <mj-text line-height="20px">
          Here's a summary of your CFP Land account usage:
        </mj-text>
      </mj-column>
    </mj-section>
    
    <!-- Summary -->
    <mj-section>
      <mj-column background-color="#6399D3" padding="30px 10px">
        <mj-text align="center" color="#fff" font-size="36px">{{ summary.savedCfpsCount }}</mj-text>
        <mj-text align="center" color="#fff" padding-top="15px">
          <a class="white-link" href="https://www.cfpland.com/c/saved/">Saved CFPs</a>
        </mj-text>
      </mj-column>
      <mj-column background-color="#998FC7" padding="30px 10px">
        <mj-text align="center" color="#fff" font-size="36px">{{ summary.appliedCfpsCount }}</mj-text>
        <mj-text align="center" color="#fff" padding-top="15px">
          <a class="white-link" href="https://www.cfpland.com/c/applied/">Pending Applications</a>
        </mj-text>
      </mj-column>
      <mj-column background-color="#73AB84" padding="30px 10px">
        <mj-text align="center" color="#fff" font-size="36px">{{ summary.acceptedCfpsCount }}</mj-text>
        <mj-text align="center" color="#fff" padding-top="15px">
          <a class="white-link" href="https://www.cfpland.com/c/accepted/">Accepted Applications</a>
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- CFPs header -->
    <mj-section border-bottom="1px dashed lightgrey">
      <mj-column>
        <mj-text font-size="24px" padding-top="10px">⭐️ Pro CFPs:</mj-text>
        <mj-text font-style="italic" color="#8d8d8d">
          A selection of CFPs available exclusively for CFP Land Pro Users.
        </mj-text>
      </mj-column>
    </mj-section>
    {{#each summary.openCfpSelection.items}}
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
          <p title="perks">
            <strong>Perks:</strong> {{ this.perks_list }}
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
          <a href="https://www.cfpland.com/conferences/{{lowercase this.category}}" class="category-tag">#{{this.category}}</a>
        </mj-text>
      </mj-column>
    </mj-section>
    {{/each}}
    
    <!-- See More -->
    <mj-section>
      <mj-column>
        <mj-text align="center" padding="20px">
          <a class="see-more-cta" href="https://www.cfpland.com/c/all/">
            View All {{ summary.openCfpCount }} Open CFPs
          </a>
        </mj-text>
      </mj-column>
    </mj-section>
    <!-- Footer -->
    <mj-section full-width="full-width" background-color="#ececec" css-class="footer" padding-bottom="30px" padding-top="30px">
      <mj-column>
        <mj-text align="center" font-size="12px" line-height="16px">
          You are receiving this email because you are a CFP Land Pro subscriber.
        </mj-text>
        <mj-text align="center" font-size="12px" line-height="16px">
          No longer interested in receiving this email?
          <a href="https://www.cfpland.com/c/communication/">Update Your Email Preferences Here</a>.
        </mj-text>
        <mj-text align="center" font-size="12px" line-height="16px">
          © 2019, <a href="https://www.cfpland.com">CFP Land</a>.
          Created by <a href="https://www.portablecto.com">Portable CTO, LLC</a>.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
