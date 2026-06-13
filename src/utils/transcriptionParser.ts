import { Question } from '../types/survey';

export const parseTranscript = (
  text: string,
  questions: Question[]
): Record<string, string> => {
  const extracted: Record<string, string> = {};
  const lowerText = text.toLowerCase();

  questions.forEach(question => {
    if (question.type === 'string' && question.fieldName === 'Participant Full Name') {
      const namePatterns = [
        /my name is ([a-z\s]+)/i,
        /i'm ([a-z\s]+)/i,
        /call me ([a-z\s]+)/i,
        /this is ([a-z\s]+)/i
      ];
      
      for (const pattern of namePatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          extracted[question.fieldName] = match[1].trim();
          break;
        }
      }
    }

    if (question.type === 'enum' && question.options) {
      for (const option of question.options) {
        const optionLower = option.toLowerCase();
        
        if (question.fieldName === 'Living Condition') {
          if ((optionLower.includes('urban') || optionLower.includes('apartment')) && 
              (lowerText.includes('apartment') || lowerText.includes('city') || lowerText.includes('urban'))) {
            extracted[question.fieldName] = option;
          } else if (optionLower.includes('suburban') && 
                     (lowerText.includes('suburb') || lowerText.includes('residential area'))) {
            extracted[question.fieldName] = option;
          } else if (optionLower.includes('rural') && 
                     (lowerText.includes('rural') || lowerText.includes('countryside') || lowerText.includes('country'))) {
            extracted[question.fieldName] = option;
          }
        }

        if (question.fieldName === 'Primary Commute Method') {
          if (optionLower.includes('remote') && 
              (lowerText.includes('remote') || lowerText.includes('work from home') || lowerText.includes('home office'))) {
            extracted[question.fieldName] = option;
          } else if (optionLower.includes('public') && 
                     (lowerText.includes('bus') || lowerText.includes('train') || lowerText.includes('transit') || lowerText.includes('metro'))) {
            extracted[question.fieldName] = option;
          } else if (optionLower.includes('vehicle') && 
                     (lowerText.includes('drive') || lowerText.includes('car') || lowerText.includes('vehicle'))) {
            extracted[question.fieldName] = option;
          }
        }

        if (question.fieldName === 'Daily Screen Time Usage') {
          if (optionLower.includes('high') && 
              (lowerText.includes('glued') || lowerText.includes('all day') || lowerText.includes('constantly') || 
               lowerText.includes('9 to 6') || lowerText.includes('stuck'))) {
            extracted[question.fieldName] = option;
          } else if (optionLower.includes('moderate') && 
                     (lowerText.includes('moderate') || lowerText.includes('sometimes') || lowerText.includes('few hours'))) {
            extracted[question.fieldName] = option;
          } else if (optionLower.includes('low') && 
                     (lowerText.includes('rarely') || lowerText.includes('minimal') || lowerText.includes('not much'))) {
            extracted[question.fieldName] = option;
          }
        }
      }
    }
  });

  return extracted;
};
