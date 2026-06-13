import { Question } from '../types/survey';

export const parseSurveyTemplate = async (template: string): Promise<Question[]> => {
  const lines = template.split('\n').filter(line => line.trim());
  
  return lines.map((line, index) => {
    const trimmed = line.trim();
    
    let type: 'string' | 'enum' = 'string';
    let options: string[] | undefined;
    
    if (trimmed.includes('(') && trimmed.includes(')')) {
      type = 'enum';
      const optionsMatch = trimmed.match(/\((.*?)\)/);
      if (optionsMatch) {
        options = optionsMatch[1].split(',').map(opt => opt.trim());
      }
    }

    const fieldName = trimmed.replace(/\(.*?\)/, '').trim();

    return {
      id: `q${index + 1}`,
      fieldName,
      type,
      options,
      conversationalGuide: `Ask naturally: "${fieldName}"`
    };
  });
};
