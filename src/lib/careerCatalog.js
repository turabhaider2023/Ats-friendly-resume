import { countActionVerbs } from './atsScore.js'
import { keywordSuggestions } from './keywords.js'
import { uid } from './resumeModel.js'

const CUSTOM_KEY = 'ats-friendly-custom-roles'

function skillList(skills, title = '') {
  const words = []
  const seen = new Set()
  const skip = title.trim().toLowerCase()
  for (const skill of skills || []) {
    const clean = String(skill || '').trim()
    const key = clean.toLowerCase()
    if (!key || key === skip || seen.has(key)) continue
    seen.add(key)
    words.push(clean)
    if (words.length >= 6) break
  }
  return words
}

function composeSummary(name, focus, skills, proof) {
  const words = skillList(skills, name)
  let skillLine = ''
  if (words.length === 1) skillLine = `Core skills include ${words[0]}.`
  else if (words.length > 1) skillLine = `Core skills include ${words.slice(0, -1).join(', ')}, and ${words[words.length - 1]}.`
  const result = proof ? `${String(proof).trim().replace(/\.+$/, '')}.` : ''
  const lead = focus
    ? `${name} with 4 years of experience ${focus}.`
    : `${name} with 4 years of experience.`
  return [lead, skillLine, result].filter(Boolean).join(' ')
}

function parseSkills(text) {
  return String(text || '')
    .split(/[,;|\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 1)
}

function role(name, details) {
  return {
    name,
    focus: details.focus,
    skills: details.skills,
    summary: composeSummary(name, details.focus, details.skills, details.now?.[0]),
    now: details.now,
    thenTitle: details.thenTitle || `Associate ${name}`,
    then: details.then,
    degree: details.degree,
    cert: details.cert,
    projectName: details.project[0],
    projectBullet: details.project[1],
  }
}

function field(id, name, fallback, roles) {
  return { id, name, fallback, roles }
}

export const FIELDS = [
  field(
    'it-services',
    'IT Services & Consulting',
    {
      degree: 'B.Tech, Computer Science',
      skills: ['Java', 'SQL', 'REST APIs', 'Git', 'Agile', 'debugging'],
      setting: 'client delivery for an IT services firm',
      cert: 'AWS Cloud Practitioner, 2023',
    },
    [
      role('Software Developer', {
        focus: 'building and supporting business applications for IT services clients',
        skills: ['Java', 'SQL', 'REST APIs', 'Git', 'Spring Boot', 'Agile'],
        degree: 'B.Tech, Computer Science',
        cert: 'Oracle Certified Associate, Java, 2023',
        now: [
          'Developed REST APIs for 3 client modules and cut average response time by 35%',
          'Fixed 40 production defects in one quarter and reduced repeat incidents by 22%',
          'Wrote unit tests that raised coverage on the billing service from 48% to 81%',
        ],
        thenTitle: 'Associate Software Developer',
        then: [
          'Built internal admin screens used by 25 support staff and cut ticket handling time by 15%',
          'Supported a 6-person delivery team through 4 client releases with no missed handover',
        ],
        project: ['Client billing service', 'Built a billing API used by 2 delivery teams and reduced invoice mismatches by 18%'],
      }),
      role('Java Developer', {
        focus: 'in Java services for banking and enterprise clients',
        skills: ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'Maven', 'Git'],
        degree: 'B.Tech, Computer Science',
        cert: 'Oracle Certified Associate, Java, 2023',
        now: [
          'Developed Spring Boot services for 2 client accounts and reduced API errors by 30%',
          'Optimized 12 slow SQL queries and cut the nightly batch from 3 hours to 70 minutes',
          'Mentored 2 junior developers and reviewed an average of 15 pull requests a week',
        ],
        then: [
          'Implemented a logging change that helped the team trace 90% of production issues in one day',
          'Supported release testing for 5 modules and logged defects with clear steps to reproduce',
        ],
        project: ['Account statement service', 'Developed a statement API that served 8,000 monthly requests with a 99% success rate'],
      }),
      role('Python Developer', {
        focus: 'writing Python services and data jobs for client projects',
        skills: ['Python', 'Django', 'SQL', 'REST APIs', 'pandas', 'Git'],
        degree: 'B.Tech, Computer Science',
        cert: 'PCAP Python certification, 2022',
        now: [
          'Built Django APIs for a client portal used by 1,200 monthly users',
          'Automated a 6-hour manual data check into a Python job that finishes in 20 minutes',
          'Reduced failed nightly jobs from 14 a month to 3 by adding retries and alerts',
        ],
        then: [
          'Developed report scripts that replaced 8 spreadsheet handoffs each week',
          'Supported a 4-person squad and documented setup steps for 3 new joiners',
        ],
        project: ['Vendor data cleaner', 'Wrote a Python cleaner for 50,000 vendor rows and cut bad records by 27%'],
      }),
      role('Frontend Developer', {
        focus: 'building web screens for client portals and internal tools',
        skills: ['JavaScript', 'React', 'HTML', 'CSS', 'REST APIs', 'Git'],
        degree: 'B.Tech, Information Technology',
        cert: 'Meta Front-End Developer Certificate, 2023',
        now: [
          'Built React screens for a client portal used by 3 business teams',
          'Reduced page load on the dashboard from 6 seconds to 2 seconds',
          'Implemented form checks that cut incomplete submissions by 24%',
        ],
        thenTitle: 'Associate Frontend Developer',
        then: [
          'Developed 15 reusable UI components adopted by 2 product squads',
          'Resolved 30 accessibility issues and improved keyboard use on the main flows',
        ],
        project: ['Status dashboard', 'Created a React dashboard that replaced a 12-page weekly status deck'],
      }),
      role('Backend Developer', {
        focus: 'designing APIs and data flows behind client products',
        skills: ['Node.js', 'SQL', 'REST APIs', 'Redis', 'Git', 'Docker'],
        degree: 'B.Tech, Computer Science',
        cert: 'AWS Cloud Practitioner, 2023',
        now: [
          'Designed REST APIs for 4 product modules and kept error rates under 1%',
          'Introduced caching that cut repeated database reads by 45%',
          'Deployed 20 releases with a rollback plan and no extended outage',
        ],
        then: [
          'Built an import job that processed 100,000 rows a night with a 98% success rate',
          'Documented API contracts used by 3 frontend developers',
        ],
        project: ['Order status API', 'Developed an order API that answered 15,000 daily status checks'],
      }),
      role('DevOps Engineer', {
        focus: 'keeping builds, releases, and cloud environments reliable',
        skills: ['Linux', 'Docker', 'CI/CD', 'AWS', 'Git', 'monitoring'],
        degree: 'B.Tech, Computer Science',
        cert: 'AWS Cloud Practitioner, 2023',
        now: [
          'Built CI pipelines that cut average release time from 2 days to 4 hours',
          'Reduced failed deployments from 8 a month to 1 by adding health checks',
          'Managed cloud spend for 6 services and lowered the monthly bill by 18%',
        ],
        thenTitle: 'Associate DevOps Engineer',
        then: [
          'Automated server setup for 12 machines and removed a 3-hour manual checklist',
          'Supported on-call for a 4-person team and documented 10 recurring incidents',
        ],
        project: ['Release pipeline', 'Created a pipeline that shipped 30 builds a month with a saved rollback step'],
      }),
      role('QA / Test Engineer', {
        focus: 'testing client releases before they reach production',
        skills: ['manual testing', 'Selenium', 'API testing', 'Jira', 'test cases', 'SQL'],
        degree: 'B.Tech, Computer Science',
        cert: 'ISTQB Foundation Level, 2022',
        now: [
          'Designed 200 test cases for 3 modules and caught 35 defects before release',
          'Automated 60 regression checks and cut the regression cycle from 5 days to 1 day',
          'Reduced escaped defects from 12 a quarter to 4 by adding an API test pass',
        ],
        thenTitle: 'Associate Test Engineer',
        then: [
          'Executed regression for 8 releases and logged defects with steps and screenshots',
          'Supported UAT with 15 business users and tracked every open item to closure',
        ],
        project: ['Regression pack', 'Built a Selenium pack covering 40 checkout cases with a 95% stable pass rate'],
      }),
      role('Technical Support Engineer', {
        focus: 'resolving client incidents for hosted applications',
        skills: ['incident handling', 'SQL', 'Linux', 'ticketing', 'customer communication', 'root cause analysis'],
        degree: 'B.Tech, Information Technology',
        cert: 'ITIL Foundation, 2022',
        now: [
          'Resolved 45 priority incidents a month and held a 96% SLA success rate',
          'Reduced repeat tickets by 28% after writing 20 knowledge-base articles',
          'Coordinated fixes with 4 engineering squads and closed severity-1 issues within 4 hours',
        ],
        thenTitle: 'Associate Support Engineer',
        then: [
          'Handled 30 tickets a day and kept first-response time under 20 minutes',
          'Identified a login defect affecting 200 users and drove the patch the same week',
        ],
        project: ['Incident guide', 'Documented the top 25 incidents so new joiners could resolve them without escalation'],
      }),
      role('IT Project Manager', {
        focus: 'running delivery for software projects with client stakeholders',
        skills: ['project planning', 'Agile', 'stakeholder management', 'Jira', 'risk tracking', 'status reporting'],
        degree: 'B.Tech, Computer Science',
        cert: 'CAPM, 2023',
        now: [
          'Managed 3 client workstreams and delivered 11 of 12 releases on the agreed date',
          'Reduced open blockers older than a week from 18 to 5 with a daily review',
          'Coordinated a 14-person team across development, test, and support',
        ],
        thenTitle: 'Project Coordinator',
        then: [
          'Tracked scope for a 9-month program and kept the status deck to one page',
          'Identified a schedule risk 3 weeks early and helped the team recover the date',
        ],
        project: ['Release calendar', 'Built a shared release calendar used by 4 client managers'],
      }),
      role('Business Analyst', {
        focus: 'turning client requirements into clear stories for delivery teams',
        skills: ['requirements', 'user stories', 'SQL', 'process mapping', 'UAT', 'stakeholder communication'],
        degree: 'BBA, Information Systems',
        cert: 'ECBA, 2023',
        now: [
          'Wrote user stories for 6 modules and cut requirement rework by 30%',
          'Mapped 4 business processes and removed 12 duplicate approval steps',
          'Led UAT with 20 users and closed 95% of feedback before go-live',
        ],
        then: [
          'Documented gaps for a legacy system used by 300 staff',
          'Supported a vendor selection and compared 5 tools against 18 must-have needs',
        ],
        project: ['Claims intake map', 'Mapped the claims intake flow and identified a handoff that delayed 15% of cases'],
      }),
    ],
  ),
  field(
    'software-product',
    'Software Product',
    {
      degree: 'B.Tech, Computer Science',
      skills: ['product delivery', 'Agile', 'SQL', 'user research', 'roadmaps', 'analytics'],
      setting: 'a software product team',
      cert: 'Professional Scrum Master I, 2023',
    },
    [
      role('Software Engineer', {
        focus: 'shipping product features from design through release',
        skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'testing'],
        degree: 'B.Tech, Computer Science',
        cert: 'Professional Scrum Master I, 2023',
        now: [
          'Shipped 14 product features and kept the crash-free rate above 99%',
          'Reduced the signup drop-off by 11% after simplifying a 6-step form',
          'Built shared components used by 3 squads and cut duplicate UI work by 20%',
        ],
        then: [
          'Developed the notifications service that sends 50,000 messages a day',
          'Resolved 25 customer-reported bugs in one quarter with fixes shipped the same sprint',
        ],
        project: ['Onboarding flow', 'Redesigned the first-run flow and lifted activation from 42% to 55%'],
      }),
      role('Full Stack Developer', {
        focus: 'building product features across the interface and the API',
        skills: ['React', 'Node.js', 'SQL', 'REST APIs', 'Git', 'AWS'],
        degree: 'B.Tech, Computer Science',
        cert: 'AWS Cloud Practitioner, 2023',
        now: [
          'Delivered 9 full-stack features from the data model through the React screen',
          'Cut API latency on the home feed from 800 ms to 250 ms',
          'Introduced typed API checks that removed a class of bugs seen in 4 releases',
        ],
        then: [
          'Built an admin tool used by 30 operations staff every day',
          'Supported the on-call rota and resolved 12 production issues without a rollback',
        ],
        project: ['Admin console', 'Created an admin console that replaced 5 manual database updates a week'],
      }),
      role('Product Manager', {
        focus: 'setting priorities and shipping product outcomes with engineering and design',
        skills: ['roadmaps', 'user research', 'Agile', 'KPIs', 'stakeholder management', 'prioritization'],
        degree: 'BBA',
        cert: 'Product management certificate, 2023',
        now: [
          'Owned a roadmap of 20 features and shipped the top 8 against a quarterly goal',
          'Grew activation by 9 points after a research study with 18 customers',
          'Prioritized a backlog of 60 items down to a 6-week plan the team could finish',
        ],
        thenTitle: 'Associate Product Manager',
        then: [
          'Wrote specs for 12 releases and kept open questions under 5 at sprint start',
          'Presented usage findings to 4 department leads every month',
        ],
        project: ['Activation plan', 'Defined the activation metric and a 90-day plan that lifted week-one use by 14%'],
      }),
      role('Product Analyst', {
        focus: 'using product data to decide what to build and what to stop',
        skills: ['SQL', 'Excel', 'experimentation', 'dashboards', 'Python', 'stakeholder communication'],
        degree: 'B.Com, Statistics',
        cert: 'Google Data Analytics Certificate, 2023',
        now: [
          'Built a retention dashboard used by 5 squads and cut status-meeting time by 30%',
          'Analyzed 16 experiments and recommended shipping 9 features',
          'Identified a drop-off that, after a fix, lifted completion by 12%',
        ],
        then: [
          'Automated a weekly report that had taken 8 hours and now runs in 1 hour',
          'Supported launch reviews for 10 features with a one-page readout',
        ],
        project: ['Funnel study', 'Mapped a 7-step funnel and found the step that lost 22% of new users'],
      }),
      role('Mobile App Developer', {
        focus: 'building and releasing mobile app features',
        skills: ['Flutter', 'REST APIs', 'mobile releases', 'Git', 'crash analysis', 'Agile'],
        degree: 'B.Tech, Computer Science',
        cert: 'Google Associate Android Developer, 2022',
        now: [
          'Shipped 11 app releases and held the crash-free rate at 99.5%',
          'Reduced the cold start time from 4 seconds to 1.8 seconds',
          'Implemented offline saving used by 6,000 field users a month',
        ],
        then: [
          'Built 8 screens from the design file and matched the approved layout',
          'Resolved store-review issues that had blocked 2 releases',
        ],
        project: ['Offline visit log', 'Developed an offline visit log that synced 3,000 records a week'],
      }),
      role('UX Designer', {
        focus: 'designing product flows that are easier to finish',
        skills: ['Figma', 'user research', 'wireframes', 'prototyping', 'design systems', 'usability testing'],
        degree: 'B.Des, Interaction Design',
        cert: 'Google UX Design Certificate, 2023',
        now: [
          'Redesigned the checkout flow and lifted completion by 13% in 6 weeks',
          'Ran usability tests with 16 users and closed the top 10 issues before launch',
          'Maintained a design system of 40 components used by 3 product squads',
        ],
        thenTitle: 'Associate UX Designer',
        then: [
          'Created wireframes for 8 features and cut design review rounds from 4 to 2',
          'Supported research sessions and turned notes into a 1-page findings brief',
        ],
        project: ['Checkout redesign', 'Prototyped a shorter checkout and tested it with 12 customers before build'],
      }),
    ],
  ),
  field(
    'bpo',
    'BPO / KPO',
    {
      degree: 'B.A.',
      skills: ['customer handling', 'CRM', 'quality checks', 'typing', 'SLA', 'communication'],
      setting: 'a BPO or KPO process',
      cert: 'Customer service certification, 2022',
    },
    [
      role('Customer Support Executive', {
        focus: 'handling customer calls and chats against a published SLA',
        skills: ['customer support', 'CRM', 'call handling', 'written English', 'SLA', 'ticketing'],
        degree: 'B.A.',
        cert: 'Customer service certification, 2022',
        now: [
          'Handled 70 contacts a day and kept customer satisfaction at 92%',
          'Resolved 85% of issues on the first contact across chat and phone',
          'Reduced repeat contacts by 18% after updating 15 help articles',
        ],
        then: [
          'Supported a 20-person floor and met the 30-second answer-time target for 3 months',
          'Documented the top 10 complaints so the next shift could close them faster',
        ],
        project: ['Help-article refresh', 'Rewrote 15 help replies and cut average handle time by 40 seconds'],
      }),
      role('Voice Process Executive', {
        focus: 'on inbound voice support for a consumer process',
        skills: ['voice process', 'call handling', 'CRM', 'English communication', 'SLA', 'quality scores'],
        degree: 'B.A.',
        cert: 'Voice and accent workshop, 2021',
        now: [
          'Answered 65 calls a day and held a quality score of 94% for 2 quarters',
          'Reduced average handle time from 7 minutes to 5 minutes without a quality drop',
          'Resolved billing questions for 1,200 customers a month on the first call',
        ],
        then: [
          'Met the schedule adherence target of 95% across 6 months',
          'Supported new-hire nesting for 8 colleagues over 2 weeks',
        ],
        project: ['Call opener script', 'Tested a shorter opener that improved the first-call resolution rate by 6 points'],
      }),
      role('Process Associate', {
        focus: 'completing back-office cases to a daily target and quality bar',
        skills: ['data processing', 'Excel', 'case handling', 'quality checks', 'SOP', 'attention to detail'],
        degree: 'B.Com',
        cert: 'Excel for operations, 2022',
        now: [
          'Processed 120 cases a day at a 98% quality score',
          'Reduced pending cases older than 48 hours from 40 to 8',
          'Identified a duplicate-entry error and saved the team about 5 hours a week',
        ],
        then: [
          'Handled a queue of 80 cases a day during a 3-month peak',
          'Trained 4 new joiners on the SOP and their first-week quality stayed above 95%',
        ],
        project: ['Case checklist', 'Created a 12-point checklist that cut common input errors by 20%'],
      }),
      role('Team Leader', {
        focus: 'running a support floor for quality, occupancy, and customer scores',
        skills: ['team leadership', 'quality audits', 'workforce planning', 'coaching', 'SLA', 'reporting'],
        degree: 'BBA',
        cert: 'Team leadership workshop, 2023',
        now: [
          'Led a team of 18 executives and lifted the quality score from 88% to 95%',
          'Reduced attrition on the team from 8 leavers a quarter to 3',
          'Coached 18 agents with weekly reviews and improved handle time by 12%',
        ],
        thenTitle: 'Senior Process Executive',
        then: [
          'Handled escalations for a 25-person process and closed 90% the same day',
          'Built a daily scorecard the manager used in the 15-minute floor huddle',
        ],
        project: ['Floor scorecard', 'Created a daily scorecard covering quality, occupancy, and 4 customer metrics'],
      }),
      role('Quality Analyst', {
        focus: 'auditing contacts and coaching agents on the quality form',
        skills: ['quality audits', 'calibration', 'coaching', 'Excel', 'call listening', 'SOP'],
        degree: 'B.A.',
        cert: 'Quality auditor workshop, 2022',
        now: [
          'Audited 40 contacts a day and published a weekly defect report for 3 teams',
          'Reduced fatal errors from 6% of audits to 2% over 2 quarters',
          'Led monthly calibration with 8 team leaders and aligned scores within 5 points',
        ],
        then: [
          'Reviewed 500 calls a month and tagged the 5 errors that drove repeat contact',
          'Supported a new quality form and trained 20 agents in one week',
        ],
        project: ['Defect tracker', 'Built an Excel tracker that showed the top 5 defects by process and shift'],
      }),
      role('MIS Executive', {
        focus: 'preparing the daily operations numbers for a BPO process',
        skills: ['Excel', 'MIS reporting', 'dashboards', 'SLA tracking', 'data checks', 'PowerPoint'],
        degree: 'B.Com',
        cert: 'Advanced Excel, 2022',
        now: [
          'Published the daily MIS for 4 processes before the 10 a.m. review',
          'Automated 12 Excel reports and saved the team 6 hours a week',
          'Identified a 9% SLA miss 2 days early so the floor could add staff',
        ],
        then: [
          'Maintained attendance and productivity sheets for 200 employees',
          'Supported month-end packs with 15 metrics and zero restatement for 4 months',
        ],
        project: ['SLA workbook', 'Built a workbook that flags any SLA under 95% before the morning huddle'],
      }),
    ],
  ),
  field(
    'banking',
    'Banking',
    {
      degree: 'B.Com, Banking',
      skills: ['customer service', 'KYC', 'core banking', 'credit basics', 'compliance', 'Excel'],
      setting: 'a bank branch or credit team',
      cert: 'NISM mutual fund certification, 2022',
    },
    [
      role('Relationship Manager', {
        focus: 'growing deposits and customer relationships at a branch',
        skills: ['relationship management', 'deposits', 'cross-sell', 'KYC', 'customer meetings', 'sales targets'],
        degree: 'MBA, Finance',
        cert: 'NISM mutual fund certification, 2022',
        now: [
          'Managed a book of 180 customers and grew deposits by 22% in one year',
          'Met 110% of the annual liability target across savings and term deposits',
          'Acquired 40 salary accounts through 6 company tie-ups',
        ],
        thenTitle: 'Personal Banker',
        then: [
          'Opened 25 new accounts a month while keeping KYC exceptions under 2%',
          'Resolved service requests for 15 walk-in customers a day',
        ],
        project: ['Salary-account drive', 'Ran a 6-company salary drive that added 40 accounts in one quarter'],
      }),
      role('Credit Analyst', {
        focus: 'assessing loan files for repayment capacity and policy fit',
        skills: ['credit analysis', 'financial statements', 'Excel', 'risk rating', 'loan documentation', 'compliance'],
        degree: 'B.Com, Accounting',
        cert: 'Credit appraisal workshop, 2023',
        now: [
          'Assessed 30 loan files a month and recommended decisions within the 3-day SLA',
          'Flagged 12 weak files that avoided an estimated exposure of several lakhs',
          'Reduced incomplete files sent back to branches from 25% to 10%',
        ],
        then: [
          'Spread 80 financial statements and built a comparison sheet the credit head used weekly',
          'Supported annual reviews for a portfolio of 50 existing borrowers',
        ],
        project: ['File checklist', 'Created a 20-point file checklist that cut return-to-branch cases by 15 points'],
      }),
      role('Branch Operations Officer', {
        focus: 'running daily branch operations, cash, and compliance checks',
        skills: ['branch operations', 'cash management', 'KYC', 'core banking', 'audit', 'customer service'],
        degree: 'B.Com',
        cert: 'KYC and AML basics, 2022',
        now: [
          'Ran daily operations for a branch serving 200 customers and closed cash with zero difference for 6 months',
          'Cleared a pending KYC list of 150 accounts before the audit date',
          'Reduced customer wait time from 18 minutes to 9 minutes by splitting the counter queue',
        ],
        thenTitle: 'Operations Assistant',
        then: [
          'Processed 40 service requests a day with a same-day completion rate of 90%',
          'Supported the branch audit and closed 14 observations in 3 weeks',
        ],
        project: ['KYC cleanup', 'Closed 150 pending KYC records and left the branch with a clean audit file'],
      }),
      role('Loan Officer', {
        focus: 'sourcing and logging retail loan applications',
        skills: ['loan sourcing', 'customer interviews', 'documentation', 'follow-up', 'Excel', 'compliance'],
        degree: 'B.Com',
        cert: 'Retail credit workshop, 2022',
        now: [
          'Logged 35 complete loan files a month and held a 70% approval rate',
          'Reduced missing-document returns from 30% of files to 12%',
          'Followed up a pipeline of 50 applicants and disbursed 20 loans in the last quarter',
        ],
        then: [
          'Collected documents for 25 files a month and updated the branch tracker daily',
          'Supported a festival campaign that added 15 applications in 2 weeks',
        ],
        project: ['Document kit', 'Built a one-page document kit that applicants used before the branch visit'],
      }),
      role('Customer Service Officer', {
        focus: 'handling branch customers for service requests and account queries',
        skills: ['customer service', 'core banking', 'complaint handling', 'KYC', 'cash', 'communication'],
        degree: 'B.Com',
        cert: 'Customer service certification, 2021',
        now: [
          'Served 50 counter customers a day and kept complaint cases under 3 a week',
          'Resolved 90% of service requests on the same day',
          'Reduced passbook and statement complaints by 20% after a counter script change',
        ],
        then: [
          'Updated KYC for 20 customers a day during a 2-month drive',
          'Supported senior-citizen hours and handled 10 assisted visits each morning',
        ],
        project: ['Counter script', 'Wrote a short script for the 8 most common requests and cut repeat questions'],
      }),
      role('Probationary Officer', {
        focus: 'rotating through branch credit, operations, and customer service',
        skills: ['branch banking', 'credit basics', 'operations', 'customer service', 'compliance', 'Excel'],
        degree: 'MBA, Banking',
        cert: 'JAIIB, 2024',
        now: [
          'Completed rotations in credit, operations, and deposits across 1 year',
          'Processed 20 loan files and 30 service requests a month during the credit rotation',
          'Supported a deposit campaign that added 25 new accounts in 6 weeks',
        ],
        thenTitle: 'Bank intern',
        then: [
          'Assisted the operations desk for 3 months and learned the core-banking menus used daily',
          'Maintained the pending-observation tracker and helped close 8 audit items',
        ],
        project: ['Rotation notes', 'Documented the daily checklist for 3 branch desks so the next officer could start faster'],
      }),
    ],
  ),
  field(
    'financial-services',
    'Financial Services',
    {
      degree: 'B.Com, Finance',
      skills: ['Excel', 'financial analysis', 'reporting', 'compliance', 'client reporting', 'research'],
      setting: 'financial services',
      cert: 'NISM research analyst certification, 2023',
    },
    [
      role('Financial Analyst', {
        focus: 'building forecasts, variance notes, and management packs',
        skills: ['Excel', 'financial modeling', 'forecasting', 'variance analysis', 'PowerPoint', 'reporting'],
        degree: 'MBA, Finance',
        cert: 'Financial modeling certificate, 2023',
        now: [
          'Built the monthly forecast for a business of 4 cost centers and kept variance notes to one page',
          'Identified a 12% cost overrun 3 weeks before month-end',
          'Automated 8 recurring workbooks and saved the team 10 hours a month',
        ],
        then: [
          'Maintained a 3-statement model used in 6 management reviews',
          'Supported the annual budget and reconciled 20 line items with no restatement',
        ],
        project: ['Monthly pack', 'Created a 6-slide monthly pack the finance head used with the business leads'],
      }),
      role('Investment Analyst', {
        focus: 'researching companies and updating coverage notes',
        skills: ['equity research', 'Excel', 'financial statements', 'valuation', 'writing', 'industry analysis'],
        degree: 'MBA, Finance',
        cert: 'NISM research analyst certification, 2023',
        now: [
          'Published notes on 8 companies and updated models after each quarterly result',
          'Built a comparable set of 15 firms used by 3 portfolio discussions',
          'Reduced model update time from 1 day to 3 hours with a linked workbook',
        ],
        then: [
          'Tracked 20 result announcements and wrote a same-day summary for the desk',
          'Supported a sector primer of 12 pages used in client meetings',
        ],
        project: ['Sector primer', 'Wrote a sector primer covering 10 companies, margins, and 3 demand drivers'],
      }),
      role('Risk Analyst', {
        focus: 'monitoring credit and operational risk indicators',
        skills: ['risk reporting', 'Excel', 'credit risk', 'KRIs', 'compliance', 'data checks'],
        degree: 'B.Com, Finance',
        cert: 'Risk management workshop, 2022',
        now: [
          'Tracked 25 risk indicators and escalated 6 breaches before the monthly committee',
          'Reduced late risk returns from 10 a month to 2 by sending a 2-day reminder',
          'Built a watchlist of 30 accounts that the credit team reviewed every Friday',
        ],
        then: [
          'Reconciled exposure data for 100 accounts and corrected 14 mismatches',
          'Supported the annual risk review with charts for 5 risk categories',
        ],
        project: ['KRI dashboard', 'Built a dashboard that flags any indicator outside its limit in red'],
      }),
      role('Wealth Manager', {
        focus: 'serving a book of clients with suitable investment products',
        skills: ['client relationships', 'mutual funds', 'portfolio reviews', 'KYC', 'financial planning', 'sales'],
        degree: 'MBA, Finance',
        cert: 'NISM mutual fund certification, 2022',
        now: [
          'Managed relationships for 70 families and completed 4 reviews a year for each active client',
          'Grew assets under advisory by 18% over 12 months',
          'Kept complaint cases at zero for 2 quarters by confirming suitability before each order',
        ],
        thenTitle: 'Relationship Associate',
        then: [
          'Prepared review packs for 30 meetings a month',
          'Completed KYC for 40 new clients with a first-pass acceptance rate of 95%',
        ],
        project: ['Review pack', 'Standardized a 4-page review pack so each meeting started from the same numbers'],
      }),
    ],
  ),
  field(
    'accounting',
    'Accounting / Taxation',
    {
      degree: 'B.Com, Accounting',
      skills: ['Excel', 'bookkeeping', 'GST', 'reconciliation', 'Tally', 'compliance'],
      setting: 'accounts and tax work',
      cert: 'Tally and GST workshop, 2022',
    },
    [
      role('Accountant', {
        focus: 'closing the books, reconciling accounts, and supporting audits',
        skills: ['accounting', 'Excel', 'reconciliation', 'Tally', 'financial reporting', 'GST'],
        degree: 'B.Com, Accounting',
        cert: 'Tally certification, 2022',
        now: [
          'Closed the monthly books for 3 entities by the 5th working day',
          'Reconciled 12 bank accounts and cleared open items older than 30 days',
          'Reduced audit queries from 28 to 9 by filing supporting papers with each schedule',
        ],
        then: [
          'Posted 200 vouchers a week with a review error rate under 1%',
          'Supported the statutory audit and answered 15 sample requests in 2 days',
        ],
        project: ['Close checklist', 'Built a 25-point close checklist that the team now follows every month'],
      }),
      role('Accounts Executive', {
        focus: 'processing vendor bills, collections, and daily accounts entries',
        skills: ['accounts payable', 'Excel', 'Tally', 'vendor follow-up', 'collections', 'GST'],
        degree: 'B.Com',
        cert: 'Tally certification, 2021',
        now: [
          'Processed 150 vendor bills a month and held a 3-day turnaround',
          'Reduced overdue collections from 40 invoices to 12 with a weekly call plan',
          'Matched GST input credit for 95% of eligible bills before the return date',
        ],
        then: [
          'Entered daily receipts for 1 entity and kept the cash book current',
          'Supported month-end and filed 8 working papers with the accountant',
        ],
        project: ['Vendor tracker', 'Created a tracker that shows every bill older than 15 days'],
      }),
      role('Tax Consultant', {
        focus: 'preparing GST and income-tax workings for clients',
        skills: ['GST', 'income tax', 'Excel', 'return filing', 'notices', 'client communication'],
        degree: 'B.Com, Taxation',
        cert: 'GST practitioner course, 2023',
        now: [
          'Filed GST returns for 25 clients and kept late filings at zero for 2 quarters',
          'Responded to 10 tax notices and closed 8 without an additional demand',
          'Reduced input-credit mismatches by 30% with a monthly reconciliation',
        ],
        then: [
          'Prepared computation sheets for 15 individual returns during the filing season',
          'Maintained a due-date calendar covering 25 clients and 4 return types',
        ],
        project: ['GST reconciliation', 'Built a workbook that matches portal data to the books for 25 clients'],
      }),
      role('Auditor', {
        focus: 'testing controls and balances during internal or statutory audits',
        skills: ['auditing', 'sampling', 'Excel', 'workpapers', 'internal controls', 'reporting'],
        degree: 'B.Com, Accounting',
        cert: 'Articleship completed, CA Intermediate',
        now: [
          'Tested controls at 6 client sites and drafted findings for the audit manager',
          'Completed sample testing on 200 transactions with every exception documented',
          'Reduced open review notes from 18 to 4 before the partner sign-off',
        ],
        thenTitle: 'Audit Associate',
        then: [
          'Prepared lead schedules for 3 audit areas and tied them to the trial balance',
          'Supported inventory counts at 2 locations covering 500 SKUs',
        ],
        project: ['Sample workbook', 'Created a sampling sheet that records the population, the sample, and each exception'],
      }),
      role('GST Executive', {
        focus: 'matching invoices and filing GST data for one or more entities',
        skills: ['GST', 'Excel', 'invoice matching', 'return filing', 'vendor follow-up', 'Tally'],
        degree: 'B.Com',
        cert: 'GST workshop, 2022',
        now: [
          'Matched 1,000 invoices a month and filed returns before the due date',
          'Reduced GSTR-2B mismatches from 80 lines to 15',
          'Followed up 30 vendors and collected missing invoices within 5 days',
        ],
        then: [
          'Entered outward supplies for 2 entities and checked tax rates on every line',
          'Supported the annual return with a month-by-month summary',
        ],
        project: ['Mismatch log', 'Kept a mismatch log that shows the vendor, the amount, and the next action'],
      }),
    ],
  ),
  field(
    'civil',
    'Civil Engineering',
    {
      degree: 'B.E., Civil Engineering',
      skills: ['AutoCAD', 'site supervision', 'quantity estimation', 'MS Project', 'quality checks', 'safety compliance'],
      setting: 'civil construction projects',
      cert: 'AutoCAD certification, 2021',
    },
    [
      role('Civil Engineer', {
        focus: 'on site execution, drawings, and quality for building projects',
        skills: ['site execution', 'AutoCAD', 'quantity estimation', 'quality checks', 'bar bending schedules', 'safety'],
        degree: 'B.E., Civil Engineering',
        cert: 'AutoCAD certification, 2021',
        now: [
          'Supervised structural work on a site with 40 workers and held rework under 3%',
          'Checked quantities for 12 work packages and kept the variation within 5%',
          'Closed 18 snag items before the client inspection',
        ],
        thenTitle: 'Junior Civil Engineer',
        then: [
          'Measured daily work and updated the site register for 6 months without a missed entry',
          'Supported cube tests and filed 30 results for the quality record',
        ],
        project: ['Slab package', 'Compiled drawings, a bar schedule, and quantities for one slab package'],
      }),
      role('Site Engineer', {
        focus: 'running daily site work, labour, and material checks',
        skills: ['site supervision', 'labour planning', 'material checks', 'AutoCAD', 'safety', 'daily reports'],
        degree: 'B.E., Civil Engineering',
        cert: 'Construction safety induction, 2022',
        now: [
          'Ran daily work for 2 blocks and met 90% of the weekly targets',
          'Reduced material wastage on cement and steel by 8% with a store check each evening',
          'Maintained the daily progress report for a team of 35 workers',
        ],
        thenTitle: 'Junior Site Engineer',
        then: [
          'Coordinated shuttering and reinforcement checks on 15 pours',
          'Identified a level mismatch before the pour and avoided a rework of 2 days',
        ],
        project: ['Daily progress sheet', 'Standardized a one-page daily report covering labour, material, and pending drawings'],
      }),
      role('Structural Engineer', {
        focus: 'checking structural drawings and site details against the design',
        skills: ['structural drawings', 'STAAD', 'AutoCAD', 'reinforcement details', 'design review', 'site visits'],
        degree: 'M.E., Structural Engineering',
        cert: 'STAAD Pro workshop, 2022',
        now: [
          'Reviewed reinforcement drawings for 3 buildings and marked 40 clashes before execution',
          'Visited site twice a week and answered detail queries within 1 day',
          'Reduced drawing revisions after the first issue from 8 to 2 per package',
        ],
        thenTitle: 'Junior Structural Engineer',
        then: [
          'Prepared bar-bending details for 10 typical elements used by the site team',
          'Supported load calculations for a small extension and documented every assumption',
        ],
        project: ['Typical detail pack', 'Issued a pack of 10 typical details that the site stopped redrawing by hand'],
      }),
      role('Quantity Surveyor', {
        focus: 'measuring work and preparing bills and variation statements',
        skills: ['quantity takeoff', 'BOQ', 'rate analysis', 'Excel', 'billing', 'contract reading'],
        degree: 'B.E., Civil Engineering',
        cert: 'Quantity surveying workshop, 2022',
        now: [
          'Prepared monthly bills for work worth a defined contract and kept disputes under 2 items',
          'Measured 20 work items on site and matched the bill to the drawings',
          'Identified an under-billed item and recovered the quantity in the next running bill',
        ],
        then: [
          'Built a BOQ of 150 lines for one package and cross-checked it with the planner',
          'Supported rate analysis for 12 items used in a variation claim',
        ],
        project: ['Running bill sheet', 'Created a bill sheet that links measurements, rates, and previous payments'],
      }),
      role('Planning Engineer', {
        focus: 'updating the project schedule and flagging delays early',
        skills: ['MS Project', 'Primavera', 'scheduling', 'progress tracking', 'Excel', 'reporting'],
        degree: 'B.E., Civil Engineering',
        cert: 'Primavera P6 basics, 2023',
        now: [
          'Updated a schedule of 400 activities every week and reported a true percent complete',
          'Flagged 5 delays at least 2 weeks before they hit the critical path',
          'Reduced the look-ahead meeting from 90 minutes to 30 minutes with a 2-week plan',
        ],
        then: [
          'Collected progress from 4 engineers and entered it the same day',
          'Supported the baseline program and checked logic on 100 activities',
        ],
        project: ['Two-week look-ahead', 'Published a look-ahead that listed crew, material, and drawings for the next 14 days'],
      }),
      role('CAD Draftsman', {
        focus: 'producing civil drawings that the site and design teams can use',
        skills: ['AutoCAD', 'drawings', 'revisions', 'layer standards', 'quantity support', 'plotting'],
        degree: 'Diploma, Civil Engineering',
        cert: 'AutoCAD certification, 2021',
        now: [
          'Produced 30 drawing sheets a month and returned mark-ups within 2 days',
          'Reduced revision errors by using a 12-point title-block checklist',
          'Maintained the drawing register for 200 sheets with the current revision marked',
        ],
        thenTitle: 'Junior Draftsman',
        then: [
          'Drafted floor plans and sections from sketches for 2 small buildings',
          'Plotted issued-for-construction sets for 4 site issues',
        ],
        project: ['Drawing register', 'Kept a register of 200 sheets so the site always printed the latest revision'],
      }),
      role('Architect', {
        focus: 'developing layouts and coordinating architectural drawings with site teams',
        skills: ['AutoCAD', 'space planning', 'working drawings', 'client presentations', 'coordination', 'Revit'],
        degree: 'B.Arch',
        cert: 'AutoCAD and Revit workshop, 2022',
        now: [
          'Developed working drawings for 2 residential projects and issued 40 coordinated sheets',
          'Reduced site queries on finishes by publishing a 6-page finish schedule',
          'Presented 3 layout options to the client and closed the plan in 2 meetings',
        ],
        thenTitle: 'Junior Architect',
        then: [
          'Drafted furniture layouts for 15 rooms and checked clearances against the brief',
          'Supported municipal drawing sets and tracked 8 submission comments to closure',
        ],
        project: ['Finish schedule', 'Issued a finish schedule that stopped 12 ad-hoc material changes on site'],
      }),
    ],
  ),
  field(
    'mechanical',
    'Mechanical Engineering',
    {
      degree: 'B.E., Mechanical Engineering',
      skills: ['AutoCAD', 'maintenance', 'production', 'quality checks', 'root cause analysis', 'safety'],
      setting: 'mechanical engineering and plant work',
      cert: 'AutoCAD mechanical workshop, 2021',
    },
    [
      role('Mechanical Engineer', {
        focus: 'supporting mechanical equipment, drawings, and shop-floor issues',
        skills: ['mechanical maintenance', 'AutoCAD', 'root cause analysis', 'spares', 'safety', 'Excel'],
        degree: 'B.E., Mechanical Engineering',
        cert: 'AutoCAD mechanical workshop, 2021',
        now: [
          'Supported 20 machines and reduced unplanned stops from 10 a month to 4',
          'Closed 15 breakdown reports with a cause and a spare-parts action',
          'Updated 8 assembly drawings after shop-floor changes',
        ],
        thenTitle: 'Graduate Engineer Trainee',
        then: [
          'Assisted preventive maintenance on 12 machines over 6 months',
          'Maintained the spare list for 30 critical parts and flagged 5 below minimum',
        ],
        project: ['Breakdown log', 'Created a breakdown log that records cause, spare used, and time lost'],
      }),
      role('Design Engineer', {
        focus: 'detailing mechanical parts and releasing drawings to the shop',
        skills: ['SolidWorks', 'AutoCAD', 'GD&T', 'drawings', 'BOM', 'design review'],
        degree: 'B.E., Mechanical Engineering',
        cert: 'SolidWorks certification, 2022',
        now: [
          'Released 25 part drawings a month with a first-pass acceptance of 90%',
          'Reduced shop queries by adding GD&T notes on 40 critical features',
          'Built BOMs for 6 assemblies and removed 10 duplicate part numbers',
        ],
        then: [
          'Detailed 50 components from layouts and kept the revision block current',
          'Supported a design review and closed 12 comments in one week',
        ],
        project: ['Assembly BOM', 'Issued a BOM that the stores team used to kit 6 assemblies without a missing part'],
      }),
      role('Production Engineer', {
        focus: 'hitting the daily production plan with quality and manpower in place',
        skills: ['production planning', 'line balancing', 'quality', 'manpower', '5S', 'Excel'],
        degree: 'B.E., Mechanical Engineering',
        cert: 'Lean manufacturing workshop, 2022',
        now: [
          'Ran a line of 25 operators and met 96% of the daily plan over a quarter',
          'Reduced changeover time from 40 minutes to 22 minutes',
          'Cut in-process rework from 7% to 3% with a start-of-shift check',
        ],
        then: [
          'Tracked hourly output for 2 shifts and escalated misses within 30 minutes',
          'Supported a 5S drive that freed 1 bay of floor space',
        ],
        project: ['Hourly board', 'Put an hourly board on the line so the shift could see the gap by 11 a.m.'],
      }),
      role('Maintenance Engineer', {
        focus: 'planning preventive maintenance and closing breakdowns',
        skills: ['preventive maintenance', 'breakdown handling', 'spares', 'root cause analysis', 'safety', 'CMMS'],
        degree: 'B.E., Mechanical Engineering',
        cert: 'Maintenance planning workshop, 2022',
        now: [
          'Completed 95% of the monthly preventive plan on 30 assets',
          'Reduced mean time to repair from 5 hours to 3 hours on the top 5 failures',
          'Built a spare min-max for 40 parts and avoided 6 stock-out stops',
        ],
        then: [
          'Attended breakdowns on the shift and wrote a cause note the same day',
          'Supported an annual shutdown of 4 days and closed 28 planned jobs',
        ],
        project: ['PM calendar', 'Published a monthly PM calendar that maintenance and production both signed'],
      }),
      role('Quality Engineer', {
        focus: 'inspecting parts and closing supplier and in-process defects',
        skills: ['quality inspection', 'drawings', 'measurement', 'CAPA', 'Excel', 'supplier follow-up'],
        degree: 'B.E., Mechanical Engineering',
        cert: 'ISO 9001 internal auditor, 2023',
        now: [
          'Inspected incoming lots and held a supplier reject rate under 2%',
          'Closed 20 corrective actions and verified 18 on the next lot',
          'Reduced customer complaints from 6 a quarter to 1',
        ],
        then: [
          'Measured 100 parts a week against the drawing and recorded every out-of-tolerance point',
          'Supported a process audit and tracked 10 findings to closure',
        ],
        project: ['Incoming log', 'Built an incoming log that shows supplier, defect, and the lot put on hold'],
      }),
    ],
  ),
  field(
    'electrical',
    'Electrical / Electronics',
    {
      degree: 'B.E., Electrical Engineering',
      skills: ['electrical maintenance', 'panels', 'AutoCAD Electrical', 'safety', 'testing', 'troubleshooting'],
      setting: 'electrical systems and site work',
      cert: 'Electrical safety workshop, 2022',
    },
    [
      role('Electrical Engineer', {
        focus: 'maintaining electrical systems and closing breakdowns safely',
        skills: ['electrical maintenance', 'panels', 'motors', 'safety', 'single-line diagrams', 'testing'],
        degree: 'B.E., Electrical Engineering',
        cert: 'Electrical safety workshop, 2022',
        now: [
          'Maintained panels and motors across 1 plant and cut electrical stops by 25%',
          'Completed 100% of the monthly insulation and earth tests on critical feeders',
          'Updated 10 single-line diagrams after panel changes',
        ],
        thenTitle: 'Graduate Engineer Trainee',
        then: [
          'Assisted shutdown work on 8 feeders with a permit-to-work on every job',
          'Logged breakdowns for 6 months and grouped them into 5 repeating causes',
        ],
        project: ['Test register', 'Started a test register so every critical feeder has a dated insulation reading'],
      }),
      role('Electronics Engineer', {
        focus: 'testing and supporting electronic assemblies and boards',
        skills: ['circuit testing', 'soldering', 'oscilloscope', 'BOM', 'failure analysis', 'documentation'],
        degree: 'B.E., Electronics Engineering',
        cert: 'IPC soldering awareness, 2022',
        now: [
          'Tested 50 assemblies a week and held a first-pass yield of 96%',
          'Identified a component fault that had caused 12 field returns',
          'Documented test steps for 8 products so a new technician could run them',
        ],
        then: [
          'Repaired 30 boards a month and recorded the failed component on each one',
          'Supported a pilot build of 100 units and listed every process miss',
        ],
        project: ['Test procedure', 'Wrote a test procedure for 8 products with the pass limit on each step'],
      }),
      role('Maintenance Engineer', {
        focus: 'keeping electrical utilities and machines available',
        skills: ['preventive maintenance', 'breakdowns', 'motors', 'safety permits', 'spares', 'CMMS'],
        degree: 'B.E., Electrical Engineering',
        cert: 'Maintenance planning workshop, 2022',
        now: [
          'Closed 90% of electrical breakdowns within the same shift',
          'Planned PM for 40 assets and completed the month at 94%',
          'Reduced repeat motor failures from 7 a quarter to 2 after a bearing check',
        ],
        then: [
          'Attended shift calls and wrote a cause note before handing over',
          'Supported a 3-day shutdown and finished 16 electrical jobs',
        ],
        project: ['Motor history', 'Logged failure history for 40 motors so repeats were visible before the next stop'],
      }),
      role('Site Engineer', {
        focus: 'installing and testing electrical works at project sites',
        skills: ['site installation', 'cable laying', 'testing', 'AutoCAD', 'safety', 'client coordination'],
        degree: 'B.E., Electrical Engineering',
        cert: 'Site safety induction, 2021',
        now: [
          'Supervised cable and panel installation for 2 floors and closed testing before handover',
          'Kept the snag list under 10 items at the client walk-down',
          'Coordinated 20 electricians and met the weekly installation target 11 weeks out of 12',
        ],
        thenTitle: 'Junior Site Engineer',
        then: [
          'Checked cable schedules against the drawing for 15 circuits',
          'Supported megger tests and filed the readings with the handover pack',
        ],
        project: ['Handover pack', 'Compiled test readings, as-built mark-ups, and a snag list for one floor'],
      }),
      role('Design Engineer', {
        focus: 'preparing electrical layouts, loads, and panel schedules',
        skills: ['AutoCAD Electrical', 'load schedules', 'panel design', 'lighting layouts', 'BOQ', 'coordination'],
        degree: 'B.E., Electrical Engineering',
        cert: 'AutoCAD Electrical, 2022',
        now: [
          'Issued lighting and power layouts for 3 floors and answered site queries within 1 day',
          'Built load schedules for 40 circuits and sized the panels from those numbers',
          'Reduced drawing clashes with civil by a weekly coordination review',
        ],
        then: [
          'Drafted 20 layout sheets from the architect background',
          'Supported the BOQ and counted points for 2 floors',
        ],
        project: ['Load schedule', 'Published a load schedule that the panel vendor used without a redraw'],
      }),
    ],
  ),
  field(
    'automobile',
    'Automobile',
    {
      degree: 'B.E., Automobile Engineering',
      skills: ['vehicle systems', 'diagnostics', 'quality', 'service', 'drawings', 'safety'],
      setting: 'automobile manufacturing or service',
      cert: 'Automotive service workshop, 2022',
    },
    [
      role('Automobile Engineer', {
        focus: 'supporting vehicle systems, tests, and shop issues',
        skills: ['vehicle systems', 'diagnostics', 'AutoCAD', 'testing', 'quality', 'root cause analysis'],
        degree: 'B.E., Automobile Engineering',
        cert: 'Automotive service workshop, 2022',
        now: [
          'Supported testing on 3 vehicle systems and closed 14 open issues before the build sign-off',
          'Reduced a repeat noise complaint from 8 vehicles a month to 2',
          'Documented test results for 20 vehicles in a format the quality team could audit',
        ],
        thenTitle: 'Graduate Engineer Trainee',
        then: [
          'Assisted line trials and recorded defects on 50 vehicles',
          'Updated 6 assembly instructions after a process change',
        ],
        project: ['Issue log', 'Kept an issue log with the system, the symptom, and the fix for 14 items'],
      }),
      role('Service Engineer', {
        focus: 'diagnosing workshop jobs and keeping service turnaround on target',
        skills: ['diagnostics', 'workshop control', 'spare parts', 'customer updates', 'service manuals', 'warranty'],
        degree: 'Diploma, Automobile Engineering',
        cert: 'Manufacturer product training, 2023',
        now: [
          'Closed 8 job cards a day and held the promised delivery on 90% of vehicles',
          'Reduced repeat repairs from 12% to 5% with a road test before delivery',
          'Explained warranty decisions to customers and kept complaint cases under 3 a month',
        ],
        then: [
          'Diagnosed electrical and engine complaints using the service manual and scan tool',
          'Supported a service camp that handled 40 vehicles in 2 days',
        ],
        project: ['Job-card board', 'Put open job cards on a board so the workshop could see anything older than 1 day'],
      }),
      role('Quality Engineer', {
        focus: 'inspecting vehicles and parts before they leave the plant or the line',
        skills: ['vehicle inspection', 'defect tracking', 'CAPA', 'drawings', 'audit', 'Excel'],
        degree: 'B.E., Mechanical Engineering',
        cert: 'IATF awareness, 2023',
        now: [
          'Inspected 30 vehicles a day and stopped defects from reaching the yard',
          'Reduced the top defect from 15 occurrences a week to 4',
          'Closed 10 supplier corrective actions and verified the next 3 lots',
        ],
        then: [
          'Recorded defects by station and showed the pareto in the daily meeting',
          'Supported a customer audit and tracked 8 findings to closure',
        ],
        project: ['Defect pareto', 'Published a weekly pareto of the top 5 defects by station'],
      }),
      role('Production Supervisor', {
        focus: 'running a vehicle or component shift to the daily plan',
        skills: ['shift supervision', 'manpower', 'line output', 'safety', 'quality', '5S'],
        degree: 'Diploma, Mechanical Engineering',
        cert: 'Shop-floor supervisor training, 2022',
        now: [
          'Supervised a shift of 30 people and met 97% of the daily build plan',
          'Reduced line stops longer than 10 minutes from 6 a week to 2',
          'Ran the start-up meeting in 15 minutes with safety, quality, and the hour plan',
        ],
        thenTitle: 'Line Incharge',
        then: [
          'Tracked hourly output and called maintenance within 5 minutes of a stop',
          'Supported a model change and trained 20 operators on the new sequence',
        ],
        project: ['Shift handover', 'Wrote a handover note covering open quality, manpower, and the first-hour target'],
      }),
    ],
  ),
  field(
    'manufacturing',
    'Manufacturing',
    {
      degree: 'B.E., Mechanical Engineering',
      skills: ['production', 'quality', 'safety', '5S', 'Excel', 'shift coordination'],
      setting: 'a manufacturing plant',
      cert: '5S and safety induction, 2021',
    },
    [
      role('Production Engineer', {
        focus: 'meeting the production plan on output, quality, and manpower',
        skills: ['production planning', 'line output', 'manpower', 'quality', 'Excel', 'shift reviews'],
        degree: 'B.E., Production Engineering',
        cert: 'Lean workshop, 2022',
        now: [
          'Met 95% of the monthly production plan across 2 lines',
          'Reduced overtime by 20% after rebalancing 6 stations',
          'Cut scrap from 4% to 2.5% with a first-off check on every batch',
        ],
        then: [
          'Reported hourly output for 3 months and highlighted any hour under target',
          'Supported a new product introduction and trained 12 operators',
        ],
        project: ['Line balance sheet', 'Rebalanced 6 stations and showed the before-and-after minutes on one sheet'],
      }),
      role('Quality Control Inspector', {
        focus: 'inspecting in-process and final output against the standard',
        skills: ['inspection', 'measuring instruments', 'drawings', 'rejection notes', 'Excel', 'sampling'],
        degree: 'Diploma, Mechanical Engineering',
        cert: 'Measurement and calibration basics, 2022',
        now: [
          'Inspected 80 samples a day and recorded every rejection with the defect name',
          'Reduced missed defects found by the customer from 5 a month to 1',
          'Held measuring tools within calibration, with zero overdue instruments for 6 months',
        ],
        thenTitle: 'Quality Inspector',
        then: [
          'Checked first-off parts for 4 machines at the start of each shift',
          'Supported incoming inspection and put 10 lots on hold with a clear reason',
        ],
        project: ['Rejection note', 'Standardized the rejection note so production could see the defect and the quantity'],
      }),
      role('Plant Supervisor', {
        focus: 'running the shift for output, safety, and housekeeping',
        skills: ['shift leadership', 'safety', 'output tracking', 'manpower', '5S', 'coordination'],
        degree: 'Diploma, Mechanical Engineering',
        cert: 'Supervisor safety training, 2022',
        now: [
          'Led a shift of 40 people and delivered the daily plan on 22 of 26 working days',
          'Recorded zero lost-time injuries on the shift for 12 months',
          'Reduced absenteeism cover issues by keeping a trained backup for 5 critical stations',
        ],
        thenTitle: 'Shift Incharge',
        then: [
          'Ran the toolbox talk every morning for 40 people in under 10 minutes',
          'Escalated material shortages before they stopped the line, with 1 day of notice on 8 occasions',
        ],
        project: ['Shift board', 'Maintained a shift board with output, safety, and the top 3 open issues'],
      }),
      role('Process Engineer', {
        focus: 'improving a manufacturing process for yield, cycle time, and stability',
        skills: ['process improvement', 'cycle time', 'yield', 'data collection', 'SOPs', 'root cause analysis'],
        degree: 'B.E., Chemical Engineering',
        cert: 'Six Sigma green belt awareness, 2023',
        now: [
          'Improved process yield from 91% to 96% on one line over 2 quarters',
          'Reduced cycle time by 12% after a time study of 20 cycles',
          'Updated 5 SOPs so the night shift followed the same settings as the day shift',
        ],
        then: [
          'Collected process data for 30 batches and plotted the variation for the review',
          'Supported a trial of 2 setting changes and recorded the result the same day',
        ],
        project: ['Yield chart', 'Plotted a weekly yield chart that made a 5-point drop visible the next morning'],
      }),
      role('CNC Operator', {
        focus: 'running CNC jobs to the drawing, the offset, and the inspection plan',
        skills: ['CNC operation', 'drawings', 'offsets', 'measuring instruments', 'tool changes', 'quality'],
        degree: 'ITI, Turner',
        cert: 'CNC programming basics, 2021',
        now: [
          'Ran 2 CNC machines and held dimensional rejects under 1% for a quarter',
          'Reduced setup time from 35 minutes to 20 minutes with a tool list at the machine',
          'Inspected the first piece on every batch before releasing the run',
        ],
        thenTitle: 'Machine Operator',
        then: [
          'Produced daily targets on 1 machine and recorded tool life for 10 tools',
          'Supported the programmer with 6 offset corrections that saved a scrapped batch',
        ],
        project: ['Setup sheet', 'Wrote a setup sheet with the tool, the offset, and the first-piece check'],
      }),
    ],
  ),
  field(
    'sales',
    'Sales & Business Development',
    {
      degree: 'BBA',
      skills: ['prospecting', 'CRM', 'pipeline', 'negotiation', 'target achievement', 'client meetings'],
      setting: 'sales and business development',
      cert: 'Sales communication workshop, 2022',
    },
    [
      role('Sales Executive', {
        focus: 'finding customers and closing a monthly sales target',
        skills: ['field sales', 'prospecting', 'CRM', 'negotiation', 'target tracking', 'product demos'],
        degree: 'BBA',
        cert: 'Sales communication workshop, 2022',
        now: [
          'Closed 110% of the quarterly target across 35 active accounts',
          'Added 20 new customers in 6 months with a weekly visit plan',
          'Kept the CRM current for every visit, with zero missing follow-ups at the Monday review',
        ],
        then: [
          'Ran 15 customer visits a week and converted 1 in 4 first meetings',
          'Supported a scheme month that added 8 extra orders',
        ],
        project: ['Visit plan', 'Built a weekly visit plan that covered every silent account older than 30 days'],
      }),
      role('Business Development Executive', {
        focus: 'opening new accounts and moving them to a first order',
        skills: ['lead generation', 'pitching', 'CRM', 'proposals', 'follow-up', 'market research'],
        degree: 'BBA',
        cert: 'Business development workshop, 2023',
        now: [
          'Generated 40 qualified leads a month and converted 12 into first orders',
          'Wrote proposals for 15 prospects and won 5 with a clear scope and price',
          'Reduced the time from first call to proposal from 10 days to 4 days',
        ],
        then: [
          'Researched 100 target accounts and built a list the manager still uses',
          'Supported 20 intro meetings and logged the next step the same day',
        ],
        project: ['Target list', 'Built a list of 100 accounts with the buyer, the need, and the last contact'],
      }),
      role('Key Account Manager', {
        focus: 'growing revenue and retention at a small set of important accounts',
        skills: ['account planning', 'negotiation', 'QBRs', 'CRM', 'stakeholder management', 'retention'],
        degree: 'MBA, Marketing',
        cert: 'Key account management workshop, 2023',
        now: [
          'Managed 8 key accounts and grew revenue from that book by 16% in one year',
          'Ran quarterly reviews with every account and left with 3 agreed actions',
          'Retained all 8 accounts and expanded 3 into a second product',
        ],
        thenTitle: 'Account Executive',
        then: [
          'Supported 12 accounts and answered service issues before they reached the review',
          'Prepared 12 review decks with last-quarter volume, issues, and the ask',
        ],
        project: ['Account plan', 'Wrote a one-page plan for each account covering the buyer, the risk, and the growth idea'],
      }),
      role('Area Sales Manager', {
        focus: 'leading distributors and a field team against an area target',
        skills: ['team leadership', 'distributor management', 'secondary sales', 'route planning', 'coaching', 'targets'],
        degree: 'BBA',
        cert: 'Frontline manager workshop, 2022',
        now: [
          'Led 6 executives and 12 distributors and delivered 105% of the area target',
          'Improved secondary sales coverage from 70% of outlets to 88%',
          'Coached each executive twice a month on joint calls',
        ],
        thenTitle: 'Senior Sales Executive',
        then: [
          'Handled the top 20 outlets in one town and grew that pocket by 14%',
          'Supported scheme claims so distributors were paid within 15 days',
        ],
        project: ['Beat plan', 'Redrew 6 beat plans so every outlet was visited on a fixed day'],
      }),
      role('Inside Sales Executive', {
        focus: 'qualifying inbound interest and booking the next conversation',
        skills: ['calling', 'CRM', 'qualification', 'email follow-up', 'demos', 'pipeline'],
        degree: 'BBA',
        cert: 'Inside sales workshop, 2022',
        now: [
          'Made 50 connected calls a day and booked 20 qualified meetings a month',
          'Lifted the connect-to-meeting rate from 8% to 14%',
          'Kept the CRM stage current for a pipeline of 80 open leads',
        ],
        then: [
          'Sent follow-up notes after every demo and reduced no-shows by 10%',
          'Supported a campaign of 500 contacts and tagged the 60 that replied',
        ],
        project: ['Call script', 'Tested a shorter script that raised the meeting-booked rate by 6 points'],
      }),
    ],
  ),
  field(
    'marketing',
    'Marketing & Advertising',
    {
      degree: 'BBA, Marketing',
      skills: ['campaigns', 'content', 'analytics', 'social media', 'SEO', 'reporting'],
      setting: 'marketing and campaigns',
      cert: 'Google Analytics certification, 2023',
    },
    [
      role('Digital Marketing Executive', {
        focus: 'running digital campaigns and reporting what they returned',
        skills: ['Google Ads', 'Meta ads', 'analytics', 'landing pages', 'Excel', 'campaign reporting'],
        degree: 'BBA, Marketing',
        cert: 'Google Ads certification, 2023',
        now: [
          'Managed a monthly ad spend and lowered cost per lead by 22%',
          'Launched 12 campaigns and paused 4 that missed the target after 7 days',
          'Built a weekly report with spend, leads, and cost that the manager used every Monday',
        ],
        then: [
          'Set up tracking on 5 landing pages and fixed 3 events that were not recording',
          'Supported a festive campaign that delivered 400 leads in 2 weeks',
        ],
        project: ['Weekly marketing report', 'Created a one-page report so the team stopped rebuilding numbers in slides'],
      }),
      role('SEO Executive', {
        focus: 'improving organic search traffic on a defined set of pages',
        skills: ['SEO', 'keyword research', 'on-page edits', 'Search Console', 'content briefs', 'analytics'],
        degree: 'B.A., Mass Communication',
        cert: 'Google Analytics certification, 2023',
        now: [
          'Grew organic sessions on 20 priority pages by 28% in 6 months',
          'Published 16 optimized pages and fixed index issues on 10 more',
          'Reduced pages stuck on page 2 of search from 14 to 6',
        ],
        then: [
          'Wrote content briefs for 20 articles with the query, the intent, and the outline',
          'Supported a site migration and checked 100 redirects',
        ],
        project: ['Keyword map', 'Mapped 50 queries to existing pages so the team stopped creating duplicates'],
      }),
      role('Marketing Manager', {
        focus: 'planning campaigns, budget, and the monthly marketing numbers',
        skills: ['campaign planning', 'budgeting', 'team coordination', 'brand', 'analytics', 'agencies'],
        degree: 'MBA, Marketing',
        cert: 'Brand management workshop, 2023',
        now: [
          'Owned the quarterly plan and delivered 8 of 9 planned campaigns on the date',
          'Managed an agency and an internal team of 4 and kept the budget variance under 5%',
          'Grew inbound leads by 18% against the same quarter last year',
        ],
        thenTitle: 'Assistant Marketing Manager',
        then: [
          'Ran 6 campaigns from brief to report and archived the creative and the result',
          'Presented the monthly numbers in a 5-slide pack',
        ],
        project: ['Campaign calendar', 'Published a quarter calendar with owner, budget, and the success number'],
      }),
      role('Content Writer', {
        focus: 'writing clear marketing and product content against a brief',
        skills: ['writing', 'editing', 'SEO basics', 'content calendars', 'research', 'brand voice'],
        degree: 'B.A., English',
        cert: 'Content writing course, 2022',
        now: [
          'Published 12 articles a month and met the editorial calendar for 2 quarters',
          'Rewrote 10 product pages and lifted time on page by 20%',
          'Edited copy for 6 campaigns with a 2-day turnaround',
        ],
        then: [
          'Wrote 40 social posts a month from a brief of 5 lines',
          'Supported the blog and kept a bank of 30 approved topics',
        ],
        project: ['Topic bank', 'Built a bank of 30 topics tied to the queries the SEO executive was tracking'],
      }),
      role('Social Media Manager', {
        focus: 'planning and publishing social content and answering comments',
        skills: ['social media', 'content calendars', 'community replies', 'basic design', 'analytics', 'campaigns'],
        degree: 'BBA, Marketing',
        cert: 'Meta marketing certificate, 2023',
        now: [
          'Published a 30-day calendar every month and missed fewer than 2 slots',
          'Grew the main page from 8,000 to 14,000 followers in 8 months',
          'Replied to comments within 4 working hours and flagged 100% of complaints to support',
        ],
        then: [
          'Designed 20 posts a month in the brand template',
          'Reported reach and the top 5 posts in a Monday note',
        ],
        project: ['Content calendar', 'Ran a 30-day calendar with the post, the asset, and the reply owner'],
      }),
    ],
  ),
  field(
    'hr',
    'Human Resources',
    {
      degree: 'MBA, Human Resources',
      skills: ['recruiting', 'employee relations', 'HRIS', 'onboarding', 'compliance', 'communication'],
      setting: 'human resources',
      cert: 'HR generalist workshop, 2022',
    },
    [
      role('HR Executive', {
        focus: 'supporting hiring, joining, and day-to-day employee queries',
        skills: ['recruiting', 'onboarding', 'HRIS', 'employee queries', 'documentation', 'Excel'],
        degree: 'MBA, Human Resources',
        cert: 'HR generalist workshop, 2022',
        now: [
          'Closed 8 positions a month and kept the average time-to-offer at 21 days',
          'Onboarded 30 joiners with a 100% document check before day one',
          'Answered employee queries with a 1-day response on 90% of tickets',
        ],
        then: [
          'Screened 40 profiles a week and shared a shortlist of 8 with the hiring manager',
          'Maintained employee files for 200 staff with a missing-document rate under 2%',
        ],
        project: ['Joining checklist', 'Created a joining checklist that stopped day-one document gaps'],
      }),
      role('Recruiter', {
        focus: 'sourcing and closing candidates for open roles',
        skills: ['sourcing', 'screening', 'interviews', 'offer rollout', 'job portals', 'stakeholder updates'],
        degree: 'MBA, Human Resources',
        cert: 'Talent acquisition workshop, 2023',
        now: [
          'Closed 10 roles a month across engineering and sales',
          'Built a pipeline of 3 qualified candidates for every open role',
          'Reduced offer declines from 25% to 12% by setting expectations before the offer',
        ],
        then: [
          'Sourced 50 profiles a week from portals and referrals',
          'Coordinated 20 interviews a week and sent feedback the same day',
        ],
        project: ['Role tracker', 'Tracked every open role with the stage, the hiring manager, and the next date'],
      }),
      role('HR Manager', {
        focus: 'running hiring, employee relations, and HR operations for a site',
        skills: ['HR operations', 'employee relations', 'hiring', 'policy', 'manager coaching', 'compliance'],
        degree: 'MBA, Human Resources',
        cert: 'Labour law workshop, 2023',
        now: [
          'Led HR for a site of 250 employees and kept joining paperwork audit-ready',
          'Reduced time-to-fill from 45 days to 28 days on the 15 hardest roles',
          'Closed 12 employee-relations cases with a written outcome in each file',
        ],
        thenTitle: 'Senior HR Executive',
        then: [
          'Supported policy rollout to 250 staff and collected acknowledgement from 98%',
          'Ran the monthly HR review with hiring, attrition, and 3 open issues',
        ],
        project: ['HR monthly review', 'Standardized a monthly review covering hiring, attrition, and open cases'],
      }),
      role('Talent Acquisition Specialist', {
        focus: 'hiring specialist roles with a mapped market and a clear process',
        skills: ['talent mapping', 'sourcing', 'stakeholder management', 'interview design', 'offers', 'analytics'],
        degree: 'MBA, Human Resources',
        cert: 'Talent acquisition workshop, 2023',
        now: [
          'Mapped the market for 6 hard-to-fill roles and kept a warm list of 40 people',
          'Cut the screening-to-interview ratio from 8:1 to 4:1 with a tighter scorecard',
          'Partnered with 10 hiring managers and sent a weekly pipeline note',
        ],
        then: [
          'Closed 6 specialist roles in one quarter',
          'Wrote scorecards for 6 roles so interviewers scored the same skills',
        ],
        project: ['Interview scorecard', 'Introduced a scorecard that made feedback comparable across 10 interviewers'],
      }),
      role('HR Generalist', {
        focus: 'covering recruiting, payroll inputs, and employee lifecycle tasks',
        skills: ['full-cycle recruiting', 'payroll inputs', 'onboarding', 'HRIS', 'engagement', 'compliance'],
        degree: 'MBA, Human Resources',
        cert: 'Payroll inputs workshop, 2022',
        now: [
          'Owned the employee lifecycle for 120 staff from offer through exit checklist',
          'Submitted payroll inputs with zero missed joiners or exits for 8 months',
          'Ran 4 engagement activities with participation above 70%',
        ],
        then: [
          'Maintained the HRIS and corrected 25 data errors found in an audit',
          'Supported exit interviews for 15 people and summarized the top 3 reasons',
        ],
        project: ['Lifecycle checklist', 'Wrote one checklist covering offer, joining, confirmation, and exit'],
      }),
    ],
  ),
  field(
    'education',
    'Education / Training',
    {
      degree: 'B.Ed.',
      skills: ['lesson planning', 'classroom delivery', 'assessment', 'parent communication', 'curriculum'],
      setting: 'education and training',
      cert: 'Classroom teaching workshop, 2022',
    },
    [
      role('School Teacher', {
        focus: 'teaching a subject, assessing students, and talking to parents',
        skills: ['lesson planning', 'classroom management', 'assessment', 'parent meetings', 'curriculum', 'remedial teaching'],
        degree: 'B.Ed.',
        cert: 'Classroom teaching workshop, 2022',
        now: [
          'Taught 5 sections and completed the syllabus with 2 weeks left for revision',
          'Raised the class average by 8 marks after a weekly remedial group of 12 students',
          'Held parent meetings for 40 families and shared a written note after each one',
        ],
        then: [
          'Planned 30 lessons a term and kept the assessment record current',
          'Supported the annual day and coordinated 25 students across 4 practice weeks',
        ],
        project: ['Remedial group', 'Ran a weekly group for 12 students and tracked marks before and after'],
      }),
      role('Lecturer', {
        focus: 'teaching college courses and assessing assigned papers',
        skills: ['lecturing', 'course planning', 'assessment', 'student mentoring', 'subject knowledge', 'academic records'],
        degree: 'M.Sc.',
        cert: 'Faculty development program, 2023',
        now: [
          'Taught 3 courses a semester to classes of about 60 students',
          'Published the assessment plan in week 1 and returned marks within 10 days',
          'Mentored 20 students and held an open hour every week',
        ],
        thenTitle: 'Assistant Lecturer',
        then: [
          'Assisted labs for 2 courses and marked 100 practical records a term',
          'Supported exam duty and invigilated 8 sessions with no incident',
        ],
        project: ['Course pack', 'Issued a course pack with the outcomes, the readings, and the assessment dates'],
      }),
      role('Corporate Trainer', {
        focus: 'delivering training sessions and measuring whether people used them',
        skills: ['training delivery', 'session design', 'facilitation', 'assessments', 'feedback', 'scheduling'],
        degree: 'MBA',
        cert: 'Train-the-trainer, 2022',
        now: [
          'Delivered 40 sessions a year to groups of 20 and held an average feedback score of 4.5 out of 5',
          'Redesigned 6 modules and cut each session from 4 hours to 2.5 hours',
          'Followed up 3 programs after 30 days and recorded which steps people still used',
        ],
        then: [
          'Coordinated schedules for 15 batches and kept cancellations under 2 a quarter',
          'Wrote participant guides for 4 programs',
        ],
        project: ['Session guide', 'Wrote a facilitator guide so a second trainer could run the same 2.5-hour session'],
      }),
      role('Academic Counsellor', {
        focus: 'guiding students and parents on courses, admissions, and next steps',
        skills: ['counseling', 'admissions', 'parent meetings', 'CRM', 'follow-up', 'communication'],
        degree: 'M.A., Education',
        cert: 'Career counseling workshop, 2022',
        now: [
          'Counselled 30 students a week and logged the recommended path the same day',
          'Converted 25% of counseling conversations into an application',
          'Ran 8 parent sessions with a written options note after each one',
        ],
        then: [
          'Maintained a CRM of 200 enquiries and followed up every open one within 3 days',
          'Supported an admission season that processed 150 applications',
        ],
        project: ['Options note', 'Created a one-page options note parents could take home after the session'],
      }),
    ],
  ),
  field(
    'healthcare',
    'Medical / Healthcare',
    {
      degree: 'B.Sc. Nursing',
      skills: ['patient care', 'documentation', 'vital signs', 'infection control', 'team coordination'],
      setting: 'a hospital or clinic',
      cert: 'Basic life support, 2023',
    },
    [
      role('Staff Nurse', {
        focus: 'on ward care, medication, and clear clinical notes',
        skills: ['patient care', 'medication rounds', 'vital signs', 'clinical documentation', 'infection control', 'handover'],
        degree: 'B.Sc. Nursing',
        cert: 'Basic life support, 2023',
        now: [
          'Cared for a ward assignment of 8 patients a shift and completed medication rounds on time',
          'Maintained handover notes that the next shift could follow without a repeat question',
          'Supported infection-control checks and recorded 100% of isolation precautions on the board',
        ],
        then: [
          'Assisted procedures and documented vital signs for 20 patients a shift',
          'Trained 3 new nurses on the ward routine during their first week',
        ],
        project: ['Handover sheet', 'Standardized a handover sheet covering condition, pending tests, and the next dose'],
      }),
      role('Medical Representative', {
        focus: 'meeting doctors and chemists and covering an assigned territory',
        skills: ['doctor calls', 'product knowledge', 'territory planning', 'chemist coverage', 'reporting', 'samples'],
        degree: 'B.Pharm',
        cert: 'Product training, 2023',
        now: [
          'Covered 80 doctors and 40 chemists and met the monthly call average of 12 a day',
          'Grew secondary sales in the territory by 15% over 2 quarters',
          'Submitted daily call reports before 8 p.m. for 6 months without a miss',
        ],
        then: [
          'Completed product certification on 4 brands before independent calls',
          'Supported 6 chemist camps and recorded the stock and the order',
        ],
        project: ['Call plan', 'Built a standard call plan so every doctor was visited on a fixed frequency'],
      }),
      role('Hospital Administrator', {
        focus: 'coordinating front office, billing queries, and department schedules',
        skills: ['hospital operations', 'front office', 'billing coordination', 'staff schedules', 'patient feedback', 'reporting'],
        degree: 'MBA, Hospital Administration',
        cert: 'Hospital operations workshop, 2022',
        now: [
          'Coordinated front office and billing for a 100-bed hospital',
          'Reduced average admission wait from 40 minutes to 20 minutes',
          'Reviewed 50 patient feedback forms a month and closed the top 5 issues with the department head',
        ],
        thenTitle: 'Operations Executive',
        then: [
          'Built the duty roster for 3 departments and covered unplanned leave the same day',
          'Supported a quality checklist and closed 12 gaps before the inspection',
        ],
        project: ['Admission tracker', 'Tracked each admission from arrival to bed so delays were visible by step'],
      }),
      role('Lab Technician', {
        focus: 'collecting samples and releasing results against the lab procedure',
        skills: ['sample collection', 'lab equipment', 'result entry', 'quality control', 'biosafety', 'documentation'],
        degree: 'DMLT',
        cert: 'Lab safety workshop, 2022',
        now: [
          'Processed 60 samples a day and released routine results within the stated time',
          'Ran daily quality controls and held zero missed controls for a quarter',
          'Reduced sample rejection from 8% to 3% by coaching the collection counter',
        ],
        then: [
          'Entered results for 40 samples a day with a second-person check on critical values',
          'Maintained reagent stock and raised indents 7 days before a stock-out',
        ],
        project: ['Rejection log', 'Logged every rejected sample with the reason so collection errors could be fixed'],
      }),
      role('Pharmacist', {
        focus: 'dispensing medicines and keeping the pharmacy record accurate',
        skills: ['dispensing', 'inventory', 'drug interactions', 'counseling', 'expiry control', 'records'],
        degree: 'B.Pharm',
        cert: 'Pharmacy practice workshop, 2022',
        now: [
          'Dispensed 100 prescriptions a day and counseled patients on dose and timing',
          'Kept expired stock at zero with a monthly expiry review of 500 SKUs',
          'Reduced stock-outs on the top 20 medicines from 6 a month to 1',
        ],
        then: [
          'Supported purchase indents and matched 30 invoices a week to the goods received',
          'Maintained the narcotic register with a daily count',
        ],
        project: ['Expiry review', 'Ran a monthly expiry review so medicines within 90 days were used or returned'],
      }),
    ],
  ),
  field(
    'pharma',
    'Pharma / Biotech',
    {
      degree: 'B.Pharm',
      skills: ['GMP', 'documentation', 'quality', 'batch records', 'safety', 'lab techniques'],
      setting: 'pharmaceutical manufacturing or research',
      cert: 'GMP induction, 2022',
    },
    [
      role('Research Associate', {
        focus: 'running experiments and recording results in a lab notebook',
        skills: ['lab techniques', 'documentation', 'data analysis', 'SOPs', 'safety', 'Excel'],
        degree: 'M.Sc., Biotechnology',
        cert: 'Lab safety certification, 2022',
        now: [
          'Ran 15 experiments a month and filed every result in the lab notebook the same day',
          'Reduced repeat experiments by 20% after a checklist for reagent prep',
          'Presented findings to a team of 6 in a monthly 10-minute review',
        ],
        then: [
          'Supported method setup for 4 assays and recorded the acceptance range',
          'Maintained sample inventory for 200 items with a unique label on each',
        ],
        project: ['Assay checklist', 'Wrote a prep checklist that cut repeat assays caused by a missed reagent'],
      }),
      role('Quality Assurance Officer', {
        focus: 'reviewing batch records and in-process checks against GMP',
        skills: ['GMP', 'batch record review', 'deviations', 'CAPA', 'audits', 'documentation'],
        degree: 'B.Pharm',
        cert: 'GMP and documentation workshop, 2023',
        now: [
          'Reviewed 20 batch records a month and returned gaps within 2 days',
          'Closed 12 deviations with a cause and a corrective action',
          'Supported 2 customer audits and tracked 9 observations to closure',
        ],
        then: [
          'Checked in-process sheets for 30 batches and stopped 4 from moving ahead with a missing sign',
          'Maintained the SOP index and marked 15 documents due for review',
        ],
        project: ['Deviation log', 'Kept a deviation log with the batch, the cause, and the date closed'],
      }),
      role('Production Officer', {
        focus: 'running a pharma production area to the batch record',
        skills: ['batch manufacturing', 'GMP', 'line clearance', 'documentation', 'yield', 'safety'],
        degree: 'B.Pharm',
        cert: 'GMP induction, 2022',
        now: [
          'Released 12 batches a month with line clearance signed before every start',
          'Held batch yield within the validated range on 95% of batches',
          'Reduced documentation errors from 10 a month to 2',
        ],
        then: [
          'Supported dispensing and recorded every material weight against the bill',
          'Trained 8 operators on the revised batch record',
        ],
        project: ['Line clearance sheet', 'Used a line-clearance sheet that the area could not skip before a batch start'],
      }),
      role('Regulatory Affairs Executive', {
        focus: 'compiling dossiers and tracking regulator queries',
        skills: ['dossiers', 'regulatory submissions', 'query responses', 'document control', 'timelines', 'labeling'],
        degree: 'M.Pharm',
        cert: 'Regulatory affairs course, 2023',
        now: [
          'Compiled 4 submission packs and tracked each query to a dated response',
          'Reduced missing documents in a pack from 8 items to 1 with a checklist',
          'Maintained a renewal calendar for 30 licenses with a 60-day reminder',
        ],
        then: [
          'Updated labels for 10 products and routed each change through document control',
          'Supported a variation filing and archived the approved copy',
        ],
        project: ['License calendar', 'Built a calendar that shows every license, its expiry, and the owner'],
      }),
    ],
  ),
  field(
    'retail',
    'Retail',
    {
      degree: 'BBA',
      skills: ['customer service', 'visual display', 'billing', 'inventory', 'store targets', 'team coordination'],
      setting: 'a retail store',
      cert: 'Retail sales workshop, 2022',
    },
    [
      role('Store Manager', {
        focus: 'running a store for sales, staff, and stock accuracy',
        skills: ['store operations', 'team leadership', 'sales targets', 'inventory', 'visual merchandising', 'customer complaints'],
        degree: 'BBA',
        cert: 'Store manager workshop, 2023',
        now: [
          'Led a store team of 12 and delivered 108% of the quarterly sales target',
          'Held stock accuracy at 98% across 3 cycle counts',
          'Reduced customer complaints from 10 a month to 3',
        ],
        thenTitle: 'Assistant Store Manager',
        then: [
          'Ran the closing shift and reconciled the till with a difference under the allowed limit',
          'Built the weekly roster for 12 people and covered leave without an empty counter',
        ],
        project: ['Opening checklist', 'Introduced an opening checklist covering cash, displays, and the top 10 SKUs'],
      }),
      role('Sales Associate', {
        focus: 'helping shoppers and converting walk-ins into billed sales',
        skills: ['customer service', 'product knowledge', 'billing', 'upselling', 'floor presentation', 'returns'],
        degree: 'B.Com',
        cert: 'Retail sales workshop, 2022',
        now: [
          'Served 40 shoppers a day and held a conversion rate of 30%',
          'Grew the average bill by 12% with a relevant add-on suggestion',
          'Processed returns within the policy and kept the queue moving',
        ],
        then: [
          'Learned the range of 200 SKUs and could answer size and care questions',
          'Supported stock replenishment and filled 15 empty facings each morning',
        ],
        project: ['Add-on card', 'Used a short card of 10 add-on pairs that lifted the average bill'],
      }),
      role('Visual Merchandiser', {
        focus: 'setting displays that match the planogram and the campaign',
        skills: ['window displays', 'planograms', 'props', 'campaign setups', 'floor walks', 'vendor coordination'],
        degree: 'B.Des',
        cert: 'Visual merchandising workshop, 2022',
        now: [
          'Changed 8 window displays a quarter to the campaign date',
          'Completed planogram resets for 20 bays within the 2-day window',
          'Walked the floor daily and corrected 10 presentation gaps before opening',
        ],
        then: [
          'Supported festival setups across 3 stores in one week',
          'Maintained the prop store and labeled 40 items for reuse',
        ],
        project: ['Display calendar', 'Published a quarter calendar with the window theme and the setup date'],
      }),
      role('Retail Operations Executive', {
        focus: 'tracking store sales, stock, and process compliance',
        skills: ['Excel', 'store reporting', 'inventory checks', 'SOP audits', 'vendor follow-up', 'coordination'],
        degree: 'B.Com',
        cert: 'Advanced Excel, 2022',
        now: [
          'Published a daily sales note for 10 stores before noon',
          'Audited SOP compliance at 6 stores and closed 80% of findings in 2 weeks',
          'Flagged 15 stock-out SKUs early enough for the next replenishment',
        ],
        then: [
          'Reconciled transfer notes for 10 stores and chased 20 open documents',
          'Supported a festival sale report with hourly numbers',
        ],
        project: ['Store scorecard', 'Built a scorecard with sales, stock-outs, and open audit points'],
      }),
    ],
  ),
  field(
    'fmcg',
    'FMCG',
    {
      degree: 'BBA',
      skills: ['distributor management', 'secondary sales', 'route planning', 'schemes', 'reporting'],
      setting: 'FMCG sales and supply',
      cert: 'FMCG sales induction, 2022',
    },
    [
      role('Territory Sales Officer', {
        focus: 'covering a territory of outlets and a distributor',
        skills: ['beat planning', 'secondary sales', 'order booking', 'distributor checks', 'schemes', 'collections'],
        degree: 'BBA',
        cert: 'FMCG sales induction, 2022',
        now: [
          'Covered 40 outlets a week and grew secondary sales by 13% in two quarters',
          'Booked orders on the beat and cut missed outlets from 8 a week to 2',
          'Checked distributor stock weekly and raised indents before a stock-out on the top 10 SKUs',
        ],
        then: [
          'Worked a senior officer’s beat for 3 months and learned every outlet by name',
          'Supported scheme claims and got 95% of bills passed in the same month',
        ],
        project: ['Beat diary', 'Kept a beat diary with the order, the stock gap, and the next visit'],
      }),
      role('Brand Executive', {
        focus: 'supporting brand plans, trade schemes, and campaign material',
        skills: ['brand support', 'trade schemes', 'artwork', 'market visits', 'reporting', 'agencies'],
        degree: 'MBA, Marketing',
        cert: 'Brand management workshop, 2023',
        now: [
          'Supported 4 trade schemes and tracked redemption against the planned outlet list',
          'Coordinated artwork for 6 packs and released each file by the print date',
          'Visited 20 outlets a month and reported whether the display matched the plan',
        ],
        then: [
          'Maintained the asset tracker for 300 pieces of point-of-sale material',
          'Compiled the monthly brand note with share, scheme, and 3 field photos',
        ],
        project: ['Scheme tracker', 'Tracked each scheme by outlet so unused stock was visible before expiry'],
      }),
      role('Area Sales Manager', {
        focus: 'delivering an area number through officers and distributors',
        skills: ['team management', 'primary sales', 'secondary sales', 'distributor reviews', 'forecasting', 'coaching'],
        degree: 'BBA',
        cert: 'Frontline manager workshop, 2022',
        now: [
          'Led 5 officers and delivered 104% of the area primary target',
          'Reviewed 8 distributors every month on stock, claims, and coverage',
          'Improved numeric distribution of 2 focus SKUs from 60% to 78% of outlets',
        ],
        thenTitle: 'Territory Sales Officer',
        then: [
          'Grew one territory by 15% before moving into the manager role',
          'Supported the forecast and corrected 10 SKUs that were over-stocked',
        ],
        project: ['Distributor review', 'Ran a one-page review covering stock cover, claims, and the coverage gap'],
      }),
      role('Supply Planner', {
        focus: 'planning finished-goods supply against a sales forecast',
        skills: ['demand planning', 'Excel', 'inventory', 'forecasting', 'S&OP', 'coordination'],
        degree: 'B.E., Industrial Engineering',
        cert: 'Supply planning workshop, 2023',
        now: [
          'Planned supply for 40 SKUs and held service level at 97%',
          'Reduced excess stock cover from 6 weeks to 4 weeks on 10 slow SKUs',
          'Flagged 5 forecast misses before the production lock, in time to change the plan',
        ],
        then: [
          'Maintained the planning sheet and reconciled dispatch to the plan every Friday',
          'Supported the monthly S&OP with numbers for demand, stock, and the gap',
        ],
        project: ['SKU cover sheet', 'Built a sheet that shows weeks of cover and highlights anything outside 3 to 5 weeks'],
      }),
    ],
  ),
  field(
    'telecom',
    'Telecom',
    {
      degree: 'B.E., Electronics and Communication',
      skills: ['networking', 'fault handling', 'customer sites', 'ticketing', 'safety'],
      setting: 'telecom networks and customer support',
      cert: 'Network basics, 2022',
    },
    [
      role('Network Engineer', {
        focus: 'monitoring links and closing network faults',
        skills: ['routing', 'switching', 'fault management', 'ticketing', 'monitoring', 'customer updates'],
        degree: 'B.E., Electronics and Communication',
        cert: 'CCNA, 2023',
        now: [
          'Monitored 80 links and closed severity-2 faults within the 4-hour target on 95% of tickets',
          'Reduced repeat faults by 20% after replacing 6 unstable last-mile devices',
          'Updated customers on 100% of open priority tickets before the SLA midpoint',
        ],
        then: [
          'Handled 15 tickets a day on the shift and escalated with the right logs attached',
          'Documented 12 standard faults so the next shift could close them faster',
        ],
        project: ['Fault playbook', 'Wrote a playbook for the 12 faults that caused most of the repeat tickets'],
      }),
      role('RF Engineer', {
        focus: 'checking radio sites for coverage, alarms, and basic optimization',
        skills: ['RF basics', 'drive tests', 'alarm handling', 'site visits', 'KPI reports', 'safety'],
        degree: 'B.E., Electronics and Communication',
        cert: 'RF fundamentals, 2022',
        now: [
          'Visited 20 sites a month and cleared alarm backlogs within 48 hours',
          'Supported drive tests on 5 clusters and listed the 10 worst samples',
          'Improved a cluster drop rate by coordinating 8 parameter and hardware actions',
        ],
        then: [
          'Filed site reports with photos, alarms, and the action owner',
          'Assisted acceptance tests for 6 new sites',
        ],
        project: ['Site report', 'Standardized a site report so optimization could act without a second visit'],
      }),
      role('Broadband Support Engineer', {
        focus: 'fixing home and small-business broadband faults',
        skills: ['fiber basics', 'CPE configuration', 'ticketing', 'customer visits', 'wiring', 'SLA'],
        degree: 'Diploma, Electronics',
        cert: 'Fiber splicing awareness, 2022',
        now: [
          'Closed 10 field tickets a day and met the same-day target on 85% of appointments',
          'Reduced repeat visits from 18% to 9% by testing the link before leaving',
          'Explained the fault in plain language and kept complaint escalations under 5 a month',
        ],
        then: [
          'Configured routers for 8 installations a day during a drive',
          'Supported the helpdesk with remote checks before a truck roll',
        ],
        project: ['Visit checklist', 'Used a checklist that included the optical reading and a speed test before closure'],
      }),
      role('Telecom Sales Executive', {
        focus: 'selling connections and upgrades in an assigned area',
        skills: ['field sales', 'product plans', 'lead follow-up', 'KYC', 'target tracking', 'retail coverage'],
        degree: 'BBA',
        cert: 'Product and KYC training, 2022',
        now: [
          'Activated 40 connections a month and met the plan target for 3 quarters',
          'Covered 25 retail outlets and kept demo stock and KYC forms available',
          'Reduced rejected KYC forms from 15% to 4%',
        ],
        then: [
          'Followed up 30 leads a week from missed calls and store walk-ins',
          'Supported a festival offer that added 20 activations in 10 days',
        ],
        project: ['Outlet route', 'Fixed a weekly route so every outlet was visited before the weekend rush'],
      }),
    ],
  ),
  field(
    'logistics',
    'Logistics / Supply Chain',
    {
      degree: 'BBA, Logistics',
      skills: ['dispatch', 'Excel', 'warehouse', 'vendors', 'track and trace', 'documentation'],
      setting: 'logistics and supply chain',
      cert: 'Supply chain basics, 2022',
    },
    [
      role('Logistics Executive', {
        focus: 'planning dispatches and tracking deliveries to the promised date',
        skills: ['dispatch planning', 'transporters', 'track and trace', 'Excel', 'documentation', 'customer updates'],
        degree: 'BBA',
        cert: 'Logistics coordination workshop, 2022',
        now: [
          'Planned 40 dispatches a week and delivered 96% on the promised date',
          'Reduced detention charges by confirming vehicle placement a day earlier',
          'Updated customers on every delay before the delivery window closed',
        ],
        then: [
          'Tracked 25 shipments a day and chased 10 that missed the first scan',
          'Filed POD copies for a month with a missing-document rate under 3%',
        ],
        project: ['Dispatch board', 'Kept a board of open shipments with the vehicle, the ETA, and the exception'],
      }),
      role('Supply Chain Analyst', {
        focus: 'reading inventory, fill rate, and supplier numbers for the weekly review',
        skills: ['Excel', 'inventory analysis', 'fill rate', 'supplier performance', 'forecast support', 'reporting'],
        degree: 'B.E., Industrial Engineering',
        cert: 'Supply chain analytics course, 2023',
        now: [
          'Published a weekly pack on fill rate, stock cover, and 10 late suppliers',
          'Identified 15 SKUs with more than 8 weeks of cover and proposed a buy pause',
          'Improved on-time supplier measurement so 20 vendors were scored the same way',
        ],
        then: [
          'Cleaned 6 months of dispatch data and removed duplicate shipment rows',
          'Supported the S&OP deck with 8 charts',
        ],
        project: ['Fill-rate pack', 'Built a weekly pack that shows fill rate by warehouse and the SKUs that missed'],
      }),
      role('Warehouse Supervisor', {
        focus: 'running inbound, storage, and dispatch inside a warehouse',
        skills: ['warehouse operations', 'pick and pack', 'inventory accuracy', 'manpower', 'safety', 'WMS'],
        degree: 'B.Com',
        cert: 'Warehouse safety, 2021',
        now: [
          'Supervised a shift of 20 and dispatched 150 orders a day',
          'Held inventory accuracy at 99% on cycle counts of 50 locations a week',
          'Reduced picking errors from 3% of orders to 1%',
        ],
        thenTitle: 'Warehouse Executive',
        then: [
          'Received 30 inbound loads a week and put stock away the same day',
          'Supported a wall-to-wall count of 2,000 locations',
        ],
        project: ['Pick path', 'Rearranged the pick path for the top 40 SKUs and cut walking time on those orders'],
      }),
      role('Procurement Executive', {
        focus: 'raising purchase orders and following vendors until the goods arrive',
        skills: ['purchase orders', 'vendor follow-up', 'three-quote comparison', 'Excel', 'GRN', 'negotiation'],
        degree: 'B.Com',
        cert: 'Procurement basics, 2022',
        now: [
          'Raised 60 purchase orders a month and followed each one to GRN',
          'Collected 3 quotes on 20 buys and documented why the order went to the selected vendor',
          'Reduced average lead time on repeat items from 15 days to 10 days',
        ],
        then: [
          'Chased 25 open orders a week and updated the planner before the need date',
          'Matched 40 invoices to GRN with a mismatch rate under 2%',
        ],
        project: ['Open-order sheet', 'Kept an open-order sheet with the need date and the vendor promise'],
      }),
    ],
  ),
  field(
    'hotels',
    'Hotels / Restaurants',
    {
      degree: 'BHM',
      skills: ['guest handling', 'shifts', 'hygiene', 'billing', 'team coordination'],
      setting: 'hotels and restaurants',
      cert: 'Food safety awareness, 2022',
    },
    [
      role('Front Office Executive', {
        focus: 'handling check-in, guest requests, and the front-desk shift',
        skills: ['check-in', 'reservations', 'guest complaints', 'billing', 'upselling', 'communication'],
        degree: 'BHM',
        cert: 'Front office operations, 2022',
        now: [
          'Checked in 40 guests a shift and kept the average wait under 5 minutes',
          'Resolved same-day complaints for 90% of cases before they reached a manager',
          'Upsold room categories on 10 stays a week where the guest had asked for options',
        ],
        then: [
          'Handled reservations and reduced no-show gaps by confirming 30 arrivals a day',
          'Supported the night audit and balanced the shift report',
        ],
        project: ['Arrival sheet', 'Prepared an arrival sheet each morning with VIP notes and pending payments'],
      }),
      role('Restaurant Manager', {
        focus: 'running a restaurant shift for service, cost, and guest comments',
        skills: ['restaurant operations', 'team leadership', 'guest recovery', 'cost control', 'rostering', 'hygiene'],
        degree: 'BHM',
        cert: 'Food safety supervisor, 2023',
        now: [
          'Led a shift of 15 and held guest scores above 4.4 out of 5 for a quarter',
          'Reduced food wastage on the line by 10% with a prep plan tied to the covers forecast',
          'Closed complaint tables during the meal on 8 out of 10 occasions',
        ],
        thenTitle: 'Restaurant Captain',
        then: [
          'Ran a section of 8 tables and trained 4 stewards on the sequence of service',
          'Supported inventory counts twice a week',
        ],
        project: ['Pre-shift briefing', 'Ran a 10-minute briefing covering 86’d items, reservations, and the allergen of the day'],
      }),
      role('Chef de Partie', {
        focus: 'running a kitchen section to the recipe, the ticket time, and hygiene rules',
        skills: ['section cooking', 'recipes', 'mise en place', 'food safety', 'wastage', 'team coordination'],
        degree: 'BHM',
        cert: 'Food safety awareness, 2022',
        now: [
          'Ran a section that plated 120 covers on a busy service',
          'Held ticket times within 15 minutes on 90% of orders',
          'Reduced section wastage by 12% with a prep list based on the last 4 weeks',
        ],
        thenTitle: 'Demi Chef de Partie',
        then: [
          'Prepped the section for service and labeled every item with the date',
          'Supported inventory and flagged 8 short ingredients before the weekend',
        ],
        project: ['Prep list', 'Wrote a prep list from the last 4 weekends so the section stopped over-producing'],
      }),
      role('Housekeeping Supervisor', {
        focus: 'releasing clean rooms and keeping public areas to the checklist',
        skills: ['room inspection', 'team allocation', 'linen', 'public areas', 'guest requests', 'lost and found'],
        degree: 'BHM',
        cert: 'Housekeeping supervision, 2022',
        now: [
          'Released 50 rooms a day after inspection and kept return-to-attendant under 5%',
          'Allocated a team of 12 so VIP rooms were ready 30 minutes before arrival',
          'Closed guest housekeeping requests within 20 minutes on 95% of calls',
        ],
        thenTitle: 'Floor Supervisor',
        then: [
          'Inspected 30 rooms a shift against a 15-point checklist',
          'Controlled linen loss with a twice-daily count',
        ],
        project: ['Room checklist', 'Used a 15-point checklist so attendants knew the miss before the supervisor arrived'],
      }),
    ],
  ),
  field(
    'media',
    'Media / Entertainment',
    {
      degree: 'B.A., Mass Communication',
      skills: ['writing', 'editing', 'research', 'deadlines', 'social publishing', 'interviews'],
      setting: 'media and content',
      cert: 'Digital journalism workshop, 2022',
    },
    [
      role('Content Writer', {
        focus: 'researching and filing stories or articles to a deadline',
        skills: ['writing', 'research', 'editing', 'SEO basics', 'interviews', 'content calendars'],
        degree: 'B.A., Mass Communication',
        cert: 'Content writing course, 2022',
        now: [
          'Filed 10 stories a month on deadline for 6 months',
          'Interviewed 20 people and checked every quote before publication',
          'Rewrote 8 older pieces and lifted average reading time by 25%',
        ],
        then: [
          'Wrote 30 short posts a month from a desk brief',
          'Maintained a source list of 40 people the desk could call',
        ],
        project: ['Source list', 'Kept a source list with the topic, the last conversation, and a working phone number'],
      }),
      role('Video Editor', {
        focus: 'cutting videos to a brief, a duration, and a publish date',
        skills: ['video editing', 'story cuts', 'captions', 'exports', 'rushes', 'feedback rounds'],
        degree: 'B.A., Mass Communication',
        cert: 'Premiere Pro workshop, 2022',
        now: [
          'Delivered 12 edits a month and met the publish slot on 11 of them',
          'Cut a standing 8-minute episode down to 6 minutes without losing the story',
          'Added captions on every published video for 2 quarters',
        ],
        then: [
          'Organized rushes for 20 shoots so the editor could find a shot in minutes',
          'Exported platform-specific files for 3 channels from one master',
        ],
        project: ['Episode template', 'Built a project template so each episode started with the same bins and caption style'],
      }),
      role('Journalist', {
        focus: 'reporting, verifying, and filing news copy',
        skills: ['reporting', 'interviews', 'verification', 'writing', 'deadlines', 'beat knowledge'],
        degree: 'M.A., Journalism',
        cert: 'News writing workshop, 2021',
        now: [
          'Filed 8 reports a month from a beat and corrected zero factual errors in the last quarter',
          'Verified documents and 2 independent sources before 15 sensitive lines were published',
          'Turned around breaking copy in under 45 minutes on 6 occasions',
        ],
        thenTitle: 'Trainee Reporter',
        then: [
          'Covered local events and filed 20 briefs the desk could publish the same day',
          'Maintained a contact book of 50 officials and residents',
        ],
        project: ['Beat notes', 'Kept dated beat notes so a follow-up story started from the last verified fact'],
      }),
      role('Social Media Executive', {
        focus: 'publishing posts and reporting what the audience did next',
        skills: ['social publishing', 'captions', 'basic design', 'community replies', 'analytics', 'calendars'],
        degree: 'BBA, Marketing',
        cert: 'Social media marketing course, 2023',
        now: [
          'Published 25 posts a month from an approved calendar',
          'Replied to comments within the same working day and passed complaints to the right desk',
          'Reported reach and the 5 best posts in a Monday note the editor used',
        ],
        then: [
          'Designed 15 story frames a week in the brand template',
          'Supported a live event with 20 posts across one day',
        ],
        project: ['Monthly calendar', 'Ran a calendar with the asset, the caption, and the publish time for 25 posts'],
      }),
    ],
  ),
  field(
    'real-estate',
    'Real Estate',
    {
      degree: 'BBA',
      skills: ['site visits', 'client follow-up', 'inventory', 'negotiation', 'documentation', 'CRM'],
      setting: 'real estate sales',
      cert: 'Real estate sales induction, 2022',
    },
    [
      role('Property Consultant', {
        focus: 'matching buyers to available inventory and closing site visits',
        skills: ['client counseling', 'site visits', 'inventory knowledge', 'follow-up', 'negotiation', 'CRM'],
        degree: 'BBA',
        cert: 'Real estate sales induction, 2022',
        now: [
          'Closed 2 bookings a month from a personal pipeline of 40 active buyers',
          'Ran 15 site visits a month and sent a written option note after each one',
          'Kept the CRM current so no active buyer went 7 days without a follow-up',
        ],
        then: [
          'Learned the inventory of 3 projects and could quote the available stacks',
          'Supported weekend site duty and logged 25 walk-in enquiries',
        ],
        project: ['Option note', 'Sent a one-page option note after each visit with the unit, the price, and the next step'],
      }),
      role('Real Estate Sales Executive', {
        focus: 'generating leads and converting them into site visits and bookings',
        skills: ['lead follow-up', 'calling', 'site sales', 'CRM', 'presentations', 'documentation'],
        degree: 'B.Com',
        cert: 'Channel sales workshop, 2022',
        now: [
          'Converted 12% of fresh leads into a site visit',
          'Booked 6 units in the last quarter from own leads and channel leads',
          'Submitted booking files with a complete-document rate of 95%',
        ],
        then: [
          'Called 40 leads a day during a launch month',
          'Supported channel partners and shared the updated price list every Monday',
        ],
        project: ['Lead sheet', 'Tracked every lead with the source, the visit date, and the reason it stalled'],
      }),
      role('Site Sales Manager', {
        focus: 'running the site sales office, the team, and the weekly booking number',
        skills: ['team leadership', 'site office', 'inventory control', 'channel partners', 'daily reporting', 'customer closure'],
        degree: 'MBA, Marketing',
        cert: 'Sales manager workshop, 2023',
        now: [
          'Led 8 executives and delivered the monthly booking target for 3 straight months',
          'Controlled inventory so a quoted unit was not offered twice',
          'Reviewed the pipeline every evening and left each executive with the next day’s calls',
        ],
        thenTitle: 'Senior Sales Executive',
        then: [
          'Closed personal bookings while learning the manager reports',
          'Hosted 10 channel meetings a month',
        ],
        project: ['Evening pipeline review', 'Ran a 20-minute review that listed only buyers visiting in the next 48 hours'],
      }),
    ],
  ),
  field(
    'design',
    'Design',
    {
      degree: 'B.Des',
      skills: ['Figma', 'visual design', 'prototypes', 'client presentations', 'design systems'],
      setting: 'design projects',
      cert: 'Figma workshop, 2023',
    },
    [
      role('Graphic Designer', {
        focus: 'designing marketing and brand creatives to a brief',
        skills: ['Illustrator', 'Photoshop', 'layout', 'brand guidelines', 'print', 'social creatives'],
        degree: 'B.Des, Graphic Design',
        cert: 'Graphic design portfolio course, 2022',
        now: [
          'Delivered 25 creatives a month and met the campaign date on 23 of them',
          'Built a template set of 12 layouts that cut repeat design time by 30%',
          'Kept print files press-ready, with 2 reprints avoided by a preflight check',
        ],
        then: [
          'Resized 40 assets a month for 5 channels from one master',
          'Supported a rebrand and updated 30 existing files to the new logo',
        ],
        project: ['Template set', 'Made 12 templates the marketing team could duplicate without breaking the grid'],
      }),
      role('UI Designer', {
        focus: 'designing interface screens that engineering can build',
        skills: ['Figma', 'UI design', 'components', 'responsive layouts', 'handoff', 'design systems'],
        degree: 'B.Des, Interaction Design',
        cert: 'Google UX Design Certificate, 2023',
        now: [
          'Designed 30 screens for 4 features and handed them off with specs',
          'Reduced design questions during build by naming every component',
          'Maintained a library of 50 components used by 2 designers',
        ],
        then: [
          'Produced responsive layouts for 10 flows at two widths',
          'Supported usability tweaks and shipped 8 visual fixes in one sprint',
        ],
        project: ['Component library', 'Published a library of 50 components so new screens reused type, color, and buttons'],
      }),
      role('UX Designer', {
        focus: 'researching tasks and prototyping flows before they are built',
        skills: ['user research', 'wireframes', 'prototyping', 'usability testing', 'Figma', 'journey maps'],
        degree: 'B.Des, Interaction Design',
        cert: 'Google UX Design Certificate, 2023',
        now: [
          'Tested 5 flows with 12 users and closed the top issues before development',
          'Mapped a journey of 8 steps and removed 2 steps that added no decision',
          'Prototyped the revised flow so stakeholders could click it in one review',
        ],
        then: [
          'Wrote research notes after 10 interviews and pulled out 5 repeated problems',
          'Supported a designer with wireframes for 6 screens',
        ],
        project: ['Clickable prototype', 'Shared a prototype that replaced a 15-page specification in the review'],
      }),
      role('Interior Designer', {
        focus: 'developing interior layouts, materials, and site coordination',
        skills: ['space planning', 'AutoCAD', 'materials', 'client presentations', 'site visits', 'BOQ support'],
        degree: 'B.Des, Interior Design',
        cert: 'AutoCAD certification, 2021',
        now: [
          'Delivered interior layouts for 6 homes and issued working drawings for each',
          'Presented 2 material options per room and closed selections in the second meeting',
          'Visited site fortnightly and answered 90% of queries before the next visit',
        ],
        then: [
          'Drafted furniture layouts for 20 rooms and checked clearances',
          'Supported BOQs and listed 100 finish items with a code',
        ],
        project: ['Material board', 'Issued a material board with the code, the vendor, and the room it belonged to'],
      }),
    ],
  ),
  field(
    'analytics',
    'Analytics & Data Science',
    {
      degree: 'B.Tech, Computer Science',
      skills: ['SQL', 'Excel', 'Python', 'dashboards', 'data checks', 'stakeholder communication'],
      setting: 'analytics and data work',
      cert: 'Google Data Analytics Certificate, 2023',
    },
    [
      role('Data Analyst', {
        focus: 'answering business questions with SQL, spreadsheets, and dashboards',
        skills: ['SQL', 'Excel', 'Tableau', 'data cleaning', 'dashboards', 'stakeholder communication'],
        degree: 'B.Sc., Statistics',
        cert: 'Google Data Analytics Certificate, 2023',
        now: [
          'Built 5 dashboards used every week by operations and commercial teams',
          'Automated a report that took 8 hours and now refreshes in under 1 hour',
          'Identified a process gap that, after a fix, reduced delayed orders by 14%',
        ],
        then: [
          'Cleaned 2 years of sales data and reconciled it to the finance total',
          'Supported monthly reviews with a one-page readout',
        ],
        project: ['Orders dashboard', 'Published a dashboard that replaced 4 separate spreadsheet reports'],
      }),
      role('Data Scientist', {
        focus: 'building and explaining models that a team can act on',
        skills: ['Python', 'SQL', 'machine learning', 'statistics', 'experimentation', 'pandas'],
        degree: 'M.Sc., Statistics',
        cert: 'Machine learning course, 2023',
        now: [
          'Built a model that ranked 10,000 leads and lifted the contact-to-meeting rate by 9%',
          'Wrote a one-page model note so the business team knew what the score meant',
          'Checked data quality on 6 input tables before each monthly refresh',
        ],
        then: [
          'Analyzed an experiment with 2 variants and recommended the one that won on the agreed metric',
          'Supported feature work and documented 12 variables in a data dictionary',
        ],
        project: ['Lead score', 'Shipped a lead score with a short note on the inputs and the limits'],
      }),
      role('MIS Executive', {
        focus: 'preparing the daily and monthly management numbers',
        skills: ['Excel', 'MIS', 'pivot tables', 'data validation', 'PowerPoint', 'deadlines'],
        degree: 'B.Com',
        cert: 'Advanced Excel, 2022',
        now: [
          'Issued the daily MIS before 10 a.m. for 6 months',
          'Automated 10 reports with formulas and saved 5 hours a week',
          'Reconciled source files so the monthly pack matched finance on 12 key lines',
        ],
        then: [
          'Maintained trackers for 4 departments and flagged breaks the same day',
          'Supported leadership slides with checked numbers',
        ],
        project: ['Daily MIS', 'Built a daily file that pulls from 3 source sheets and highlights any broken total'],
      }),
      role('Business Intelligence Analyst', {
        focus: 'modeling data and publishing reports people trust',
        skills: ['SQL', 'Power BI', 'data modeling', 'DAX', 'stakeholder workshops', 'documentation'],
        degree: 'B.Tech, Information Technology',
        cert: 'Microsoft Power BI certification, 2023',
        now: [
          'Published 6 Power BI reports and retired 15 emailed spreadsheets',
          'Modeled a star schema for 8 fact tables and documented the grain of each',
          'Reduced “numbers do not match” questions from 10 a week to 2',
        ],
        then: [
          'Wrote SQL for 20 source extracts and checked row counts after every load',
          'Trained 12 report users in a 1-hour session',
        ],
        project: ['Sales report', 'Replaced a 15-sheet workbook with one report and a single refresh'],
      }),
    ],
  ),
  field(
    'customer-service',
    'Customer Service',
    {
      degree: 'B.A.',
      skills: ['customer support', 'ticketing', 'written communication', 'CRM', 'SLA', 'escalations'],
      setting: 'customer service',
      cert: 'Customer service certification, 2022',
    },
    [
      role('Customer Service Executive', {
        focus: 'resolving customer issues on calls, chat, or email',
        skills: ['customer support', 'CRM', 'email writing', 'call handling', 'product knowledge', 'SLA'],
        degree: 'B.A.',
        cert: 'Customer service certification, 2022',
        now: [
          'Resolved 55 contacts a day and kept satisfaction at 90%',
          'Closed 80% of emails within the published time',
          'Reduced repeat contacts by updating 10 saved replies that were out of date',
        ],
        then: [
          'Learned 4 product flows and handled them without a supervisor after week 3',
          'Supported a peak week at 70 contacts a day',
        ],
        project: ['Saved replies', 'Rewrote 10 saved replies so customers got the current policy in the first response'],
      }),
      role('Customer Success Manager', {
        focus: 'keeping a book of customers active and flagging risk early',
        skills: ['account health', 'onboarding', 'QBRs', 'retention', 'product adoption', 'CRM'],
        degree: 'BBA',
        cert: 'Customer success workshop, 2023',
        now: [
          'Managed 25 accounts and retained 92% of them at renewal',
          'Onboarded 10 new customers with a 30-day plan and a named admin',
          'Ran quarterly reviews and left each account with 3 actions',
        ],
        thenTitle: 'Customer Success Associate',
        then: [
          'Tracked usage for 40 accounts and flagged 8 that had gone quiet',
          'Supported onboarding calls and wrote the follow-up the same day',
        ],
        project: ['Health sheet', 'Kept a health sheet with last login, open issues, and the renewal date'],
      }),
      role('Call Center Executive', {
        focus: 'answering inbound calls against a handle-time and quality target',
        skills: ['call handling', 'CRM', 'quality scores', 'product knowledge', 'schedule adherence', 'escalation'],
        degree: 'B.A.',
        cert: 'Voice process training, 2021',
        now: [
          'Answered 60 calls a day and held a quality score above 90% for 2 quarters',
          'Met schedule adherence of 95%',
          'Escalated only the cases outside the published policy, about 8% of calls',
        ],
        then: [
          'Completed nesting with a quality score above 85% in week 2',
          'Supported a new product launch and learned 20 fresh questions in the first week',
        ],
        project: ['Policy card', 'Kept a one-page policy card at the desk for the 15 questions that caused most holds'],
      }),
    ],
  ),
  field(
    'legal',
    'Legal',
    {
      degree: 'LL.B.',
      skills: ['legal research', 'drafting', 'contracts', 'compliance', 'filings', 'case tracking'],
      setting: 'legal practice or an in-house team',
      cert: 'Contract drafting workshop, 2023',
    },
    [
      role('Legal Associate', {
        focus: 'drafting, research, and matter tracking for a supervising lawyer',
        skills: ['legal research', 'drafting', 'contracts', 'case tracking', 'filings', 'client notes'],
        degree: 'LL.B.',
        cert: 'Contract drafting workshop, 2023',
        now: [
          'Drafted first versions of 20 contracts and incorporated partner comments within 2 days',
          'Researched 15 questions and filed a note with the cases relied on',
          'Maintained a matter list of 40 items with the next date on each',
        ],
        then: [
          'Prepared filing sets for 10 matters and checked pagination before submission',
          'Supported client calls and sent a written note the same day',
        ],
        project: ['Matter list', 'Kept a matter list so every file showed the forum, the next date, and the open task'],
      }),
      role('Compliance Officer', {
        focus: 'tracking regulatory tasks and evidence for a company',
        skills: ['compliance calendars', 'policy', 'filings', 'evidence files', 'training follow-up', 'reporting'],
        degree: 'LL.B.',
        cert: 'Compliance workshop, 2022',
        now: [
          'Ran a compliance calendar of 30 filings and missed none in the last year',
          'Collected evidence for 12 controls before the internal review',
          'Trained 80 staff on one policy and stored acknowledgement for 97% of them',
        ],
        then: [
          'Updated 8 policies and routed each one through the approver list',
          'Supported a regulator query and assembled the file in 3 days',
        ],
        project: ['Compliance calendar', 'Published a calendar with the filing, the owner, and the evidence to keep'],
      }),
      role('Corporate Lawyer', {
        focus: 'advising on commercial contracts and company filings',
        skills: ['commercial contracts', 'company law', 'negotiations', 'board support', 'due diligence', 'drafting'],
        degree: 'LL.B.',
        cert: 'Corporate law course, 2023',
        now: [
          'Negotiated 15 commercial contracts and closed 12 within the business deadline',
          'Supported due diligence on 2 transactions and listed 20 findings in a tracker',
          'Prepared board notes for 6 meetings with the resolution and the supporting paper',
        ],
        thenTitle: 'Legal Associate',
        then: [
          'Drafted NDAs and vendor contracts from an approved playbook',
          'Maintained the statutory register and flagged 5 filings 30 days early',
        ],
        project: ['Contract playbook', 'Wrote a playbook of fallback positions for the 10 clauses vendors marked most often'],
      }),
    ],
  ),
  field(
    'energy',
    'Oil, Gas & Energy',
    {
      degree: 'B.E., Mechanical Engineering',
      skills: ['operations', 'HSE', 'maintenance', 'permits', 'reporting', 'site coordination'],
      setting: 'energy and oil-and-gas sites',
      cert: 'HSE induction, 2022',
    },
    [
      role('Petroleum Engineer', {
        focus: 'supporting production surveillance and well-related reporting',
        skills: ['production surveillance', 'well reporting', 'Excel', 'operations liaison', 'data checks', 'HSE'],
        degree: 'B.E., Petroleum Engineering',
        cert: 'Production operations course, 2023',
        now: [
          'Watched daily production for a set of wells and flagged 10 deviations within a shift',
          'Prepared a weekly well note used by the operations review',
          'Reconciled allocated volumes to the fiscal number for 3 months with the gaps explained',
        ],
        thenTitle: 'Graduate Engineer',
        then: [
          'Maintained the production database and corrected 20 entry errors',
          'Supported a well test and filed the raw readings the same day',
        ],
        project: ['Well note', 'Standardized a one-page well note with rate, downtime, and the recommended action'],
      }),
      role('HSE Officer', {
        focus: 'running site safety checks, permits, and incident reporting',
        skills: ['safety inspections', 'permits to work', 'incident reports', 'toolbox talks', 'compliance', 'training records'],
        degree: 'B.Sc., Environment and Safety',
        cert: 'NEBOSH IGC, 2023',
        now: [
          'Completed 20 site inspections a month and closed 85% of actions by the due date',
          'Ran daily toolbox talks for crews of 25',
          'Recorded zero overdue high-risk actions for a quarter',
        ],
        then: [
          'Issued permits and stopped 6 jobs that started without one',
          'Maintained training records for 100 workers and flagged 12 expired cards',
        ],
        project: ['Action tracker', 'Tracked every inspection action with the owner and the due date'],
      }),
      role('Operations Engineer', {
        focus: 'supporting daily plant operations, handover, and small improvements',
        skills: ['plant operations', 'shift handover', 'readings', 'troubleshooting', 'permits', 'reporting'],
        degree: 'B.E., Chemical Engineering',
        cert: 'Plant operations induction, 2022',
        now: [
          'Supported daily operations and wrote a handover the incoming shift could act on',
          'Investigated 8 process upsets and recorded the cause and the corrective step',
          'Reduced a recurring alarm from 30 a week to 8 after a setpoint review',
        ],
        then: [
          'Logged hourly readings for 3 months without a missed round',
          'Supported a shutdown and closed 12 assigned tasks',
        ],
        project: ['Shift handover', 'Rewrote the handover so it listed only alarms, permits, and equipment out of service'],
      }),
      role('Solar Site Engineer', {
        focus: 'installing and commissioning solar plant work on site',
        skills: ['solar installation', 'testing', 'drawings', 'safety', 'commissioning', 'snag closure'],
        degree: 'B.E., Electrical Engineering',
        cert: 'Solar PV installation workshop, 2023',
        now: [
          'Supervised installation on a site and kept daily progress against a 12-week plan',
          'Completed string testing and filed readings before commissioning',
          'Closed 25 snags ahead of the handover walk',
        ],
        thenTitle: 'Junior Site Engineer',
        then: [
          'Checked module layout against the drawing for 4 tables a day',
          'Supported safety walks and recorded 10 observations',
        ],
        project: ['Commissioning file', 'Compiled test readings, as-built notes, and the snag list in one handover file'],
      }),
    ],
  ),
]

export function loadCustomRoles() {
  try {
    const data = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '{}')
    if (!data || typeof data !== 'object') return {}
    const clean = {}
    for (const [fieldId, roles] of Object.entries(data)) {
      if (!Array.isArray(roles)) continue
      const names = roles
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 1 && item.length <= 60)
      clean[fieldId] = [...new Set(names)].slice(0, 20)
    }
    return clean
  } catch {
    return {}
  }
}

export function saveCustomRoles(rolesByField) {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(rolesByField))
  } catch {
    // Storage limits should not block the draft.
  }
}

export function fieldById(id) {
  return FIELDS.find((item) => item.id === id) || FIELDS[0]
}

function knownRole(roleName) {
  const needle = roleName.trim().toLowerCase()
  for (const career of FIELDS) {
    const match = career.roles.find((item) => item.name.toLowerCase() === needle)
    if (match) return match
  }
  return null
}

export function suggestedSkills(fieldId, roleName) {
  const known = knownRole(roleName || '')
  if (known) return known.skills.slice(0, 8)
  return keywordSuggestions(roleName || '', '').slice(0, 8)
}

function customProfile(career, roleName, userSkills = []) {
  const fallback = career.fallback
  const title = roleName.trim()
  const listed = keywordSuggestions(title, '')
  const skills = (userSkills.length ? userSkills : listed).slice(0, 8)
  const tools = skillList(skills, title)
  const primary = tools[0] || title
  const second = tools[1] || primary
  const focus = `in ${fallback.setting}`
  const now = [
    `Led ${title.toLowerCase()} work with ${primary} and closed 90% of weekly items on time`,
    `Coordinated follow-ups around ${second} and cut open delays by 18%`,
    'Documented the result in a one-page update a manager could review in 10 minutes',
  ]
  return {
    name: title,
    focus,
    skills,
    summary: composeSummary(title, focus, skills, now[0]),
    now,
    thenTitle: `Junior ${title}`,
    then: [
      `Supported the ${title.toLowerCase()} on daily tasks and finished a peak week with no missed handover`,
      'Maintained trackers for 30 open items and reduced stale items by 15%',
    ],
    degree: fallback.degree,
    cert: fallback.cert,
    projectName: `${title} tracker`,
    projectBullet: `Built a tracker for ${title.toLowerCase()} work with the owner, the due date, and the current status`,
  }
}

function profileFor(career, roleName, userSkills) {
  const trimmed = roleName.trim()
  const known = knownRole(trimmed)
  if (known) return { profile: known, custom: false }
  return { profile: customProfile(career, trimmed, userSkills), custom: true }
}

export function buildDraftResume({ fullName, fieldId, roleName, photo = '', template = 'classic', skillsText = '' }) {
  const career = fieldById(fieldId)
  const userSkills = parseSkills(skillsText)
  const { profile, custom } = profileFor(career, roleName, userSkills)
  const skills = userSkills.length ? userSkills : profile.skills
  const now = [...profile.now]
  const verbText = [...now, ...profile.then, profile.projectBullet].map((line) => `- ${line}`).join('\n')
  if (countActionVerbs(verbText) < 3) {
    now.push('Documented the weekly result, supported the handover, and improved the next cycle by 10%')
  }
  const resume = {
    fullName: fullName.trim(),
    targetRole: profile.name,
    email: '',
    phone: '',
    location: 'City, India',
    linkedin: '',
    website: '',
    photo: photo || '',
    template: template || 'classic',
    summary: composeSummary(profile.name, profile.focus, skills, profile.now?.[0]),
    skillsText: skills.join(', '),
    certificationsText: profile.cert,
    experience: [
      {
        id: uid(),
        title: profile.name,
        company: 'Your company',
        location: 'City, India',
        start: 'Jan 2022',
        end: '',
        current: true,
        bulletText: now.join('\n'),
      },
      {
        id: uid(),
        title: profile.thenTitle,
        company: 'Previous company',
        location: 'City, India',
        start: 'Jul 2019',
        end: 'Dec 2021',
        current: false,
        bulletText: profile.then.join('\n'),
      },
    ],
    education: [
      {
        id: uid(),
        degree: profile.degree,
        school: 'Your college',
        location: 'City, India',
        year: '2019',
        details: '',
      },
    ],
    projects: [
      {
        id: uid(),
        name: profile.projectName,
        link: '',
        bulletText: profile.projectBullet,
      },
    ],
  }
  return { resume, fieldName: career.name, roleName: profile.name, custom }
}
