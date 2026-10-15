let counter = 0

export function uid() {
  counter += 1
  return `id-${Date.now().toString(36)}-${counter}`
}

export function emptyJob() {
  return {
    id: uid(),
    title: '',
    company: '',
    location: '',
    start: '',
    end: '',
    current: false,
    bulletText: '',
  }
}

export function emptySchool() {
  return {
    id: uid(),
    degree: '',
    school: '',
    location: '',
    year: '',
    details: '',
  }
}

export function emptyProject() {
  return {
    id: uid(),
    name: '',
    link: '',
    bulletText: '',
  }
}

export function emptyResume() {
  return {
    fullName: '',
    targetRole: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
    skillsText: '',
    certificationsText: '',
    photo: '',
    template: 'classic',
    experience: [emptyJob()],
    education: [emptySchool()],
    projects: [],
  }
}

export function exampleResume() {
  return {
    fullName: 'Meera Kapoor',
    targetRole: 'Product Analyst',
    email: 'meera.kapoor@email.com',
    phone: '(555) 010-0148',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/meerakapoor',
    website: '',
    photo: '',
    template: 'classic',
    summary:
      'Product analyst with 4 years of experience turning product usage data into decisions. Comfortable with SQL, experimentation, and explaining tradeoffs to engineering and design.',
    skillsText:
      'SQL, Excel, Python, Tableau, A/B testing, stakeholder communication, data visualization, Agile',
    certificationsText: 'Google Data Analytics Certificate, 2023',
    experience: [
      {
        id: uid(),
        title: 'Product Analyst',
        company: 'Northwind Labs',
        location: 'Bengaluru, India',
        start: 'Jan 2022',
        end: '',
        current: true,
        bulletText:
          'Built a weekly retention dashboard used by 6 product squads, cutting status-meeting time by 30%\nAnalyzed experiment results for 18 launches and recommended shipping 11 features\nWrote SQL models that reduced manual reporting from 8 hours a week to 1 hour',
      },
      {
        id: uid(),
        title: 'Business Analyst',
        company: 'Harbor Commerce',
        location: 'Pune, India',
        start: 'Jul 2019',
        end: 'Dec 2021',
        current: false,
        bulletText:
          'Mapped the checkout funnel and identified a drop-off that, after a fix, lifted completion by 12%\nPartnered with operations to automate a refund report covering 4,000 monthly cases',
      },
    ],
    education: [
      {
        id: uid(),
        degree: 'B.Com, Accounting and Finance',
        school: 'Pune University',
        location: 'Pune, India',
        year: '2019',
        details: '',
      },
    ],
    projects: [
      {
        id: uid(),
        name: 'Public transit delay study',
        link: '',
        bulletText:
          'Cleaned 2 years of delay data in Python and published a one-page brief for a local civic group',
      },
    ],
  }
}
