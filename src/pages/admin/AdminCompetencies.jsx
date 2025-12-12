import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { XQ_COMPETENCIES } from '../../utils/competenciesData';

function AdminCompetencies() {
  const [expandedOutcomes, setExpandedOutcomes] = useState({});
  const [expandedCompetencies, setExpandedCompetencies] = useState({});
  const [expandedSkills, setExpandedSkills] = useState({});
  const [expandedSubSkills, setExpandedSubSkills] = useState({});

  const toggleOutcome = (index) => {
    setExpandedOutcomes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleCompetency = (outcomeIndex, compIndex) => {
    const key = `${outcomeIndex}-${compIndex}`;
    setExpandedCompetencies(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSkill = (outcomeIndex, compIndex, skillIndex) => {
    const key = `${outcomeIndex}-${compIndex}-${skillIndex}`;
    setExpandedSkills(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSubSkill = (outcomeIndex, compIndex, skillIndex, subSkillIndex) => {
    const key = `${outcomeIndex}-${compIndex}-${skillIndex}-${subSkillIndex}`;
    setExpandedSubSkills(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto md:p-4">
      {/* Header */}
      <div className="mb-8">
        <h2 className="my-0 mb-1 text-[1.75rem] text-[#1a1a1a]">XQ Competencies</h2>
        <p className="m-0 text-[#6b7280] text-[0.95rem]">View and explore all XQ Learner Outcomes and Competencies</p>
      </div>

      {/* Competencies Tree */}
      <div className="space-y-4">
        {XQ_COMPETENCIES.XQCompetencies.map((outcome, outcomeIndex) => (
          <div key={outcomeIndex} className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
            {/* Learner Outcome Header */}
            <button
              onClick={() => toggleOutcome(outcomeIndex)}
              className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-[#f9fafb] cursor-pointer bg-transparent border-none"
            >
              <div className="flex items-center gap-3">
                <div className="text-[1.5rem]">🎓</div>
                <div>
                  <h3 className="m-0 text-[1.25rem] text-[#1a1a1a] font-semibold">
                    {outcome.LearnerOutcome}
                  </h3>
                </div>
              </div>
              {expandedOutcomes[outcomeIndex] ? (
                <ChevronDown className="w-6 h-6 text-[#6b7280]" />
              ) : (
                <ChevronRight className="w-6 h-6 text-[#6b7280]" />
              )}
            </button>

            {/* Competencies List */}
            {expandedOutcomes[outcomeIndex] && (
              <div className="border-t border-[#e5e7eb]">
                {outcome.Competencies.map((competency, compIndex) => (
                  <div key={compIndex} className="border-b border-[#e5e7eb] last:border-b-0">
                    {/* Competency Header */}
                    <button
                      onClick={() => toggleCompetency(outcomeIndex, compIndex)}
                      className="w-full flex items-center justify-between p-5 pl-12 text-left transition-colors hover:bg-[#f9fafb] cursor-pointer bg-transparent border-none md:pl-8"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[0.85rem] font-mono text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded">
                            {competency.Code}
                          </span>
                          <h4 className="m-0 text-[1.05rem] text-[#1a1a1a] font-semibold">
                            {competency.Name}
                          </h4>
                        </div>
                        <p className="m-0 mt-2 text-[0.9rem] text-[#6b7280] leading-relaxed">
                          {competency.Description}
                        </p>
                      </div>
                      {expandedCompetencies[`${outcomeIndex}-${compIndex}`] ? (
                        <ChevronDown className="w-5 h-5 text-[#6b7280] ml-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-[#6b7280] ml-4 flex-shrink-0" />
                      )}
                    </button>

                    {/* Component Skills */}
                    {expandedCompetencies[`${outcomeIndex}-${compIndex}`] && (
                      <div className="bg-[#f9fafb] p-4 pl-12 md:pl-8">
                        {competency.ComponentSkills.map((skill, skillIndex) => (
                          <div key={skillIndex} className="mb-4 last:mb-0 bg-white rounded-lg border border-[#e5e7eb] overflow-hidden">
                            {/* Skill Header */}
                            <button
                              onClick={() => toggleSkill(outcomeIndex, compIndex, skillIndex)}
                              className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-[#f9fafb] cursor-pointer bg-transparent border-none"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[0.8rem] font-mono text-[#059669] bg-[#d1fae5] px-2 py-0.5 rounded">
                                  {skill.SkillCode}
                                </span>
                                <h5 className="m-0 text-base text-[#1a1a1a] font-semibold">
                                  {skill.SkillName}
                                </h5>
                              </div>
                              {expandedSkills[`${outcomeIndex}-${compIndex}-${skillIndex}`] ? (
                                <ChevronDown className="w-5 h-5 text-[#6b7280]" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-[#6b7280]" />
                              )}
                            </button>

                            {/* Sub-Skills */}
                            {expandedSkills[`${outcomeIndex}-${compIndex}-${skillIndex}`] && (
                              <div className="border-t border-[#e5e7eb] p-4 space-y-3">
                                {skill.SubSkills.map((subSkill, subSkillIndex) => (
                                  <div key={subSkillIndex} className="bg-[#f9fafb] rounded-lg border border-[#e5e7eb] overflow-hidden">
                                    {/* Sub-Skill Header */}
                                    <button
                                      onClick={() => toggleSubSkill(outcomeIndex, compIndex, skillIndex, subSkillIndex)}
                                      className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-[#f3f4f6] cursor-pointer bg-transparent border-none"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-[0.75rem] font-mono text-[#7c3aed] bg-[#ede9fe] px-2 py-0.5 rounded">
                                          {subSkill.Code}
                                        </span>
                                        <h6 className="m-0 text-[0.9rem] text-[#1a1a1a] font-semibold">
                                          {subSkill.Name}
                                        </h6>
                                      </div>
                                      {expandedSubSkills[`${outcomeIndex}-${compIndex}-${skillIndex}-${subSkillIndex}`] ? (
                                        <ChevronDown className="w-4 h-4 text-[#6b7280]" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4 text-[#6b7280]" />
                                      )}
                                    </button>

                                    {/* Progressions */}
                                    {expandedSubSkills[`${outcomeIndex}-${compIndex}-${skillIndex}-${subSkillIndex}`] && (
                                      <div className="border-t border-[#e5e7eb] p-3 bg-white">
                                        <h6 className="m-0 mb-3 text-[0.85rem] text-[#6b7280] font-semibold uppercase tracking-wide">
                                          Progression Levels
                                        </h6>
                                        <div className="space-y-3">
                                          {Object.entries(subSkill.Progressions).map(([level, description]) => (
                                            <div key={level} className="flex gap-3">
                                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-[0.75rem] font-bold mt-0.5">
                                                {level.charAt(0)}
                                              </div>
                                              <div className="flex-1">
                                                <div className="text-[0.85rem] font-semibold text-[#1a1a1a] mb-1">
                                                  {level}
                                                </div>
                                                <div className="text-[0.85rem] text-[#374151] leading-relaxed">
                                                  {description}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-[#eff6ff] border border-[#2563eb] rounded-lg p-6">
        <h3 className="m-0 mb-2 text-[1.05rem] text-[#1a1a1a]">💡 About XQ Competencies</h3>
        <p className="m-0 text-[0.9rem] text-[#374151] leading-relaxed">
          These competencies represent the knowledge, skills, and dispositions students develop throughout their internship experiences. 
          Each competency includes detailed progression levels from Emerging through Applying, allowing for nuanced assessment of student growth.
        </p>
      </div>
    </div>
  );
}

export default AdminCompetencies;
