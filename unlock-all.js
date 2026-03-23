// Run this in browser console to unlock all modules
// Copy-paste the entire contents of this file

var modules = {};
var ids = ['1.1','1.2','1.3','1.4','1.5','1.6','2.1','2.2','2.3','2.4','2.5','2.6','3.1','3.2','3.3','3.4','3.5','4.1','4.2','4.3','4.4','4.5','4.6','5.1','5.2','5.3','5.4','5.5','5.6'];
for (var i = 0; i < ids.length; i++) {
  modules[ids[i]] = { simulationComplete: true, verified: true, quizBestScore: 5, quizAttempts: 1, completedAt: new Date().toISOString() };
}
localStorage.setItem('local:secops-progress', JSON.stringify({ modules: modules }));
localStorage.setItem('local:secops-profile', JSON.stringify({ callsign: 'Admin', totalXP: 5000, streak: 7, longestStreak: 7, lastActiveDate: new Date().toISOString().split('T')[0], createdAt: '2026-03-20', leaderboardOptIn: false }));
localStorage.setItem('local:secops-terminal', JSON.stringify({ masteredCommands: [], challengesCompleted: [] }));

var badges = {};
var badgeIds = ['first-scan','secret-keeper','pipeline-builder','full-stack-scanner','quiz-master','vault-guardian','policy-enforcer','scenario-survivor','academy-graduate'];
for (var j = 0; j < badgeIds.length; j++) {
  badges[badgeIds[j]] = { unlocked: true, unlockedAt: new Date().toISOString() };
}
localStorage.setItem('local:secops-badges', JSON.stringify(badges));

alert('All modules unlocked! Page will reload.');
location.reload();
