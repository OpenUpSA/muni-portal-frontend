module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      settings: {
        skipAudits: ["redirects-http", "is-on-https"],
      }
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      assertions: {
        'categories:pwa': ['error', {minScore: 1}]
      }
    },
  },
};
