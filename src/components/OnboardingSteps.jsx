import React from 'react';

export const steps = (
  formData,
  handleChange,
  handleCheckboxChange,
  generatedLists // Accept the full lists of options
) => [
  {
    title: "Personal Details",
    content: (
      <>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
        />
        <input
          type="number"
          name="age"
          placeholder="Your age"
          value={formData.age}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
        />
        <input
          type="text"
          name="field"
          placeholder="What's the field you like?"
          value={formData.field}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
        />
      </>
    ),
  },
  {
    title: "Education",
    content: (
      <>
        <input
          type="text"
          name="lastEducation"
          placeholder="Last Completed Education"
          value={formData.lastEducation}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
        />
      </>
    ),
  },
  {
    title: "Interested Fields",
    content: (
      <>
        <label className="block font-semibold">Select Interested Fields:</label>
        {generatedLists.interestedFields.map((field) => (
          <label key={field} className="block">
            <input
              type="checkbox"
              checked={formData.interestedFields.includes(field)}
              onChange={() => handleCheckboxChange("interestedFields", field)}
            />
            <span className="ml-2">{field}</span>
          </label>
        ))}
        <textarea
          name="interestedFieldsText"
          placeholder="Any other fields you're interested in?"
          value={formData.interestedFieldsText}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl mt-3"
        />
      </>
    ),
  },
  {
    title: "Skills You Have",
    content: (
      <>
        <label className="block font-semibold">Select Skills:</label>
        {generatedLists.skills.map((skill) => (
          <label key={skill} className="block">
            <input
              type="checkbox"
              checked={formData.skills.includes(skill)}
              onChange={() => handleCheckboxChange("skills", skill)}
            />
            <span className="ml-2">{skill}</span>
          </label>
        ))}
        <textarea
          name="skillsText"
          placeholder="Any other skills you have?"
          value={formData.skillsText}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl mt-3"
        />
      </>
    ),
  },
  {
    title: "Work Experience",
    content: (
      <>
        <textarea
          name="workExperience"
          placeholder="Tell us about your work experience..."
          value={formData.workExperience}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
        />
      </>
    ),
  },
];