# XQ Competencies Feature

## Overview
This feature displays the XQ Competencies in an expandable/collapsible tree structure within the Admin section of the InternTracker app.

## Files Created/Modified

### New Files:
1. `src/pages/admin/AdminCompetencies.jsx` - Main competencies display component
2. `src/utils/competenciesData.js` - Data file containing the competencies (needs to be updated with complete data)

### Modified Files:
1. `src/App.jsx` - Added route for `/admin/competencies`
2. `src/pages/admin/AdminDashboard.jsx` - Added button to navigate to competencies page

## How to Add Complete Competencies Data

Once Gemini finishes converting the full XQ competencies to JSON:

1. Open `src/utils/competenciesData.js`
2. Replace the `XQ_COMPETENCIES` object with the complete JSON structure from Gemini
3. Make sure the structure follows this format:

```javascript
export const XQ_COMPETENCIES = {
  "XQCompetencies": [
    {
      "LearnerOutcome": "Learner Outcome Name",
      "Competencies": [
        {
          "Name": "Competency Name",
          "Code": "CODE",
          "Description": "Description text",
          "ComponentSkills": [
            {
              "SkillName": "Skill Name",
              "SkillCode": "CODE",
              "SubSkills": [
                {
                  "Name": "Sub-skill Name",
                  "Code": "CODE",
                  "Progressions": {
                    "1. Emerging": "Description",
                    "2. Developing": "Description",
                    "3. Proficient": "Description",
                    "4. Applying": "Description"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
```

## Features

- **Hierarchical Display**: Learner Outcomes → Competencies → Component Skills → Sub-Skills → Progressions
- **Collapsible Sections**: Each level can be expanded/collapsed independently
- **Color Coding**: Different badge colors for each hierarchical level
- **Responsive Design**: Works on mobile and desktop
- **Visual Indicators**: Chevron icons show expand/collapse state
- **Progression Levels**: Shows all four levels (Emerging, Developing, Proficient, Applying) for each sub-skill

## Accessing the Page

1. Log in as an admin
2. Go to the Admin Dashboard (`/admin`)
3. Click the "XQ Competencies" card in the Quick Actions section
4. Or navigate directly to `/admin/competencies`

## Future Enhancements (Optional)

- Search/filter functionality
- Export to PDF
- Link competencies to student assessments
- Progress tracking for individual students
- Print-friendly view
