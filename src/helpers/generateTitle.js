export function generateTitle(postType, helpType, activityType) {
  if (postType === 'HELP_REQUEST') {
    return `I need some help with ${helpType.toLowerCase().replace('_', ' ')}!`;
  }
  return `Going for a ${activityType.toLowerCase()} activity: anyone joining?`;
}

// TODO remove later after integrating API calls, redundant