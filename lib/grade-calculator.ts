// lib/grade-calculator.ts
// GPA calculation system (SLIIT standard)

export interface GradeResult {
  percentage: number
  letterGrade: string
  gradePoint: number
  remarks: string
}

// Convert percentage to letter grade and GPA
export function calculateGrade(marks: number, maxMarks: number): GradeResult {
  const percentage = maxMarks > 0
    ? Math.round((marks / maxMarks) * 100)
    : 0

  if (percentage >= 90) return { percentage, letterGrade: "A",  gradePoint: 4.0, remarks: "Excellent" }
  if (percentage >= 85) return { percentage, letterGrade: "A-", gradePoint: 3.7, remarks: "Very Good" }
  if (percentage >= 80) return { percentage, letterGrade: "B+", gradePoint: 3.3, remarks: "Good" }
  if (percentage >= 75) return { percentage, letterGrade: "B",  gradePoint: 3.0, remarks: "Good" }
  if (percentage >= 70) return { percentage, letterGrade: "B-", gradePoint: 2.7, remarks: "Satisfactory" }
  if (percentage >= 65) return { percentage, letterGrade: "C+", gradePoint: 2.3, remarks: "Satisfactory" }
  if (percentage >= 60) return { percentage, letterGrade: "C",  gradePoint: 2.0, remarks: "Pass" }
  if (percentage >= 55) return { percentage, letterGrade: "C-", gradePoint: 1.7, remarks: "Pass" }
  if (percentage >= 40) return { percentage, letterGrade: "D",  gradePoint: 1.0, remarks: "Weak Pass" }
  return { percentage, letterGrade: "F", gradePoint: 0.0, remarks: "Fail" }
}

// Calculate CGPA from multiple grades
export function calculateCGPA(
  grades: Array<{ gradePoint: number; credits: number }>
): number {
  if (grades.length === 0) return 0

  const totalWeightedPoints = grades.reduce(
    (sum, g) => sum + g.gradePoint * g.credits, 0
  )
  const totalCredits = grades.reduce(
    (sum, g) => sum + g.credits, 0
  )

  if (totalCredits === 0) return 0
  return Math.round((totalWeightedPoints / totalCredits) * 100) / 100
}

// Get grade color for UI
export function getGradeColor(letterGrade: string): {
  color: string
  bg: string
} {
  if (["A", "A-"].includes(letterGrade)) {
    return { color: "#059669", bg: "#ecfdf5" }
  }
  if (["B+", "B", "B-"].includes(letterGrade)) {
    return { color: "#2563eb", bg: "#eff6ff" }
  }
  if (["C+", "C", "C-"].includes(letterGrade)) {
    return { color: "#d97706", bg: "#fffbeb" }
  }
  if (letterGrade === "D") {
    return { color: "#ea580c", bg: "#fff7ed" }
  }
  return { color: "#dc2626", bg: "#fef2f2" }
}