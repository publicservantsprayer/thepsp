'use server'

import { ChatXAI } from '@langchain/xai'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { saveAiRequest } from '@/lib/firebase/firestore/ai-requests'
import {
  singleLeaderAiQuerySchema,
  stateExecutiveStructureSchema,
} from '@/lib/firebase/firestore/leaders.schema'
import { State } from '@/lib/types'
import { z } from 'zod'
import { legislativeDistrictSchema } from '@/app/(frontend)/psp-admin/states/[id]/legislative/find-legislative-ai-request-form'

export async function legislativeDistrictLeaderRequest(
  query: string,
  state: State,
) {
  mustGetCurrentAdmin()
  const model = 'grok-beta'

  const grok = new ChatXAI({
    model,
    temperature: 1,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
  })

  // const structuredModel = grok.withStructuredOutput(legislativeDistrictSchema, {
  //   includeRaw: true,
  //   name: 'The legislative districts and their leaders.',
  // })
  const structuredModel = grok.withStructuredOutput(legislativeDistrictSchema)
  const response = await structuredModel.invoke([
    [
      'system',
      'You are a helpful data researcher that translates content from the web into structured data. Please extract the data from this html table, providing district, public official name, and their URL in a structured format.',
    ],
    ['user', htmlTest],
  ])

  await saveAiRequest({
    query,
    response,
    type: 'legislativeDistrict',
    stateCode: state.ref.id,
    model,
    createdAt: new Date(),
  })

  console.log('response', response)

  return legislativeDistrictSchema.parse(response)
}

const htmlTest = `<table>
  <thead>
    <tr>
      <th>District</th>
      <th>Name</th>
      <th>Party</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Indiana State Senate District 1</td>
      <td>Dan Dernulc</td>
      <td>https://ballotpedia.org/1</td>
    </tr>
    <tr>
      <td>Indiana State Senate District 2</td>
      <td>Lonnie Randolph</td>
      <td>https://ballotpedia.org/2</td>
    </tr>
    <tr>
      <td>Indiana State Senate District 3</td>
      <td>Mark Spencer</td>
      <td>https://ballotpedia.org/3</td>
    </tr>
  </tbody>
</table>`

const htmlTable = `<table class="bptable gray sortable jquery-tablesorter" id="officeholder-table" style="width:auto; border-bottom:1px solid #bcbcbc;">
	<thead>
       	<tr colspan="4" style="background:#4c4c4c!important;color:#fff!important;text-align:center;padding: 7px 8px 8px;margin-bottom:4px;">
	 	          <th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Office</th>

           <th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Name</th>
                		   <th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Party</th>
           <th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Date assumed office</th>
		</tr>
	</thead>
	       <tbody><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_1">Indiana State Senate District 1</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Dan_Dernulc">Dan Dernulc</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 9, 2022</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_2">Indiana State Senate District 2</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Lonnie_Randolph">Lonnie Randolph</a></td>
        				  	<td class="partytd Democratic">Democratic </td>
	    									<td style="text-align:center;">2008</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_3">Indiana State Senate District 3</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Mark_Spencer_(Indiana)">Mark Spencer</a></td>
        				  	<td class="partytd Democratic">Democratic </td>
	    									<td style="text-align:center;">November 6, 2024</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_4">Indiana State Senate District 4</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Rodney_Pol_Jr.">Rodney Pol Jr.</a></td>
        				  	<td class="partytd Democratic">Democratic </td>
	    									<td style="text-align:center;">November 1, 2021</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_5">Indiana State Senate District 5</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Ed_Charbonneau">Ed Charbonneau</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">2007</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_6">Indiana State Senate District 6</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Rick_Niemeyer">Rick Niemeyer</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 5, 2014</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_7">Indiana State Senate District 7</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Brian_Buchanan">Brian Buchanan</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">February 12, 2018</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_8">Indiana State Senate District 8</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Mike_Bohacek">Mike Bohacek</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 9, 2016</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_9">Indiana State Senate District 9</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Ryan_Mishler">Ryan Mishler</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">2004</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_10">Indiana State Senate District 10</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/David_Niezgodski">David Niezgodski</a></td>
        				  	<td class="partytd Democratic">Democratic </td>
	    									<td style="text-align:center;">November 9, 2016</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_11">Indiana State Senate District 11</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Linda_Rogers">Linda Rogers</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 7, 2018</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_12">Indiana State Senate District 12</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Blake_Doriot">Blake Doriot</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 9, 2016</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_13">Indiana State Senate District 13</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Susan_Glick">Susan Glick</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">2010</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_14">Indiana State Senate District 14</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Tyler_Johnson_(Indiana)">Tyler Johnson</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 9, 2022</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_15">Indiana State Senate District 15</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Liz_Brown">Liz Brown</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 5, 2014</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_16">Indiana State Senate District 16</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Justin_Busch">Justin Busch</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 6, 2018</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_17">Indiana State Senate District 17</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Andy_Zay">Andy Zay</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">December 20, 2016</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_18">Indiana State Senate District 18</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Stacey_Donato">Stacey Donato</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">September 11, 2019</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_19">Indiana State Senate District 19</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Travis_Holdman">Travis Holdman</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">2008</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_20">Indiana State Senate District 20</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Scott_Baldwin">Scott Baldwin</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 4, 2020</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_21">Indiana State Senate District 21</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/James_Buck">James Buck</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">2008</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_22">Indiana State Senate District 22</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Ronnie_Alting">Ronnie Alting</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">1998</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_23">Indiana State Senate District 23</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Spencer_Deery">Spencer Deery</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 9, 2022</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_24">Indiana State Senate District 24</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Brett_A._Clark_(Indiana)">Brett A. Clark</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 6, 2024</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_25">Indiana State Senate District 25</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Mike_Gaskill">Mike Gaskill</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 9, 2022</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_26">Indiana State Senate District 26</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Scott_Alexander_(Indiana)">Scott Alexander</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 9, 2022</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_27">Indiana State Senate District 27</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Jeff_Raatz">Jeff Raatz</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 5, 2014</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_28">Indiana State Senate District 28</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Michael_Crider">Michael Crider</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 7, 2012</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_29">Indiana State Senate District 29</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/J.D._Ford">J.D. Ford</a></td>
        				  	<td class="partytd Democratic">Democratic </td>
	    									<td style="text-align:center;">November 7, 2018</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_30">Indiana State Senate District 30</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Fady_Qaddoura">Fady Qaddoura</a></td>
        				  	<td class="partytd Democratic">Democratic </td>
	    									<td style="text-align:center;">November 4, 2020</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_31">Indiana State Senate District 31</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Kyle_Walker_(Indiana)">Kyle Walker</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 17, 2020</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_32">Indiana State Senate District 32</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Aaron_Freeman">Aaron Freeman</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 9, 2016</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_33">Indiana State Senate District 33</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Greg_Taylor_(Indiana)">Greg Taylor</a></td>
        				  	<td class="partytd Democratic">Democratic </td>
	    									<td style="text-align:center;">2008</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_34">Indiana State Senate District 34</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/La_Keisha_Jackson">La Keisha Jackson</a></td>
        				  	<td class="partytd Democratic">Democratic </td>
	    									<td style="text-align:center;">April 18, 2024</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_35">Indiana State Senate District 35</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/R._Michael_Young_(Indiana)">Michael Young</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">2000</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_36">Indiana State Senate District 36</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Cyndi_Carrasco">Cyndi Carrasco</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 1, 2023</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_37">Indiana State Senate District 37</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Rodric_D._Bray">Rodric D. Bray</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 7, 2012</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_38">Indiana State Senate District 38</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Greg_Goode_(Indiana)">Greg Goode</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 1, 2023</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_39">Indiana State Senate District 39</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Eric_Bassler">Eric Bassler</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 5, 2014</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_40">Indiana State Senate District 40</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Shelli_Yoder">Shelli Yoder</a></td>
        				  	<td class="partytd Democratic">Democratic </td>
	    									<td style="text-align:center;">November 4, 2020</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_41">Indiana State Senate District 41</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Greg_Walker">Greg Walker</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">2006</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_42">Indiana State Senate District 42</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Jean_Leising">Jean Leising</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">2008</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_43">Indiana State Senate District 43</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Randy_Maxwell">Randy Maxwell</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">September 28, 2023</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_44">Indiana State Senate District 44</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Eric_Koch">Eric Koch</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 9, 2016</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_45">Indiana State Senate District 45</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Chris_Garten">Chris Garten</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">November 7, 2018</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_46">Indiana State Senate District 46</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Andrea_Hunley">Andrea Hunley</a></td>
        				  	<td class="partytd Democratic">Democratic </td>
	    									<td style="text-align:center;">November 9, 2022</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_47">Indiana State Senate District 47</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Gary_Byrne">Gary Byrne</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">February 14, 2022</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_48">Indiana State Senate District 48</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Daryl_Schmitt">Daryl Schmitt</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">September 10, 2024</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_49">Indiana State Senate District 49</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Jim_Tomes">Jim Tomes</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">2010</td>
          </tr><tr>
        			<td style="padding-left:10px;"><a href="https://ballotpedia.org/Indiana_State_Senate_District_50">Indiana State Senate District 50</a></td>
			<td style="padding-left:10px;text-align:center;"><a href="https://ballotpedia.org/Vaneta_Becker">Vaneta Becker</a></td>
        				  	<td class="partytd Republican">Republican </td>
	    									<td style="text-align:center;">2005</td>
    	</tr>
</tbody></table>`
