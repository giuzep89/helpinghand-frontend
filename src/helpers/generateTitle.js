export function generateTitle(postType, helpType, activityType) {
  if (postType === 'HELP_REQUEST') {
    return `I need some help with ${helpType}!`;
  }
  return `Going for a ${activityType} activity: anyone joining?`;
}

// TODO remove later after integrating API calls, redundant