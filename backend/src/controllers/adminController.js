import { pool } from '../libs/db.js'

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Sessions
    const [totalSessionsResult] = await pool.query('SELECT COUNT(*) as count FROM TutoringSessions')
    const totalSessions = totalSessionsResult[0].count

    // 2. Participation Rate (Completed / Total)
    const [completedSessionsResult] = await pool.query("SELECT COUNT(*) as count FROM TutoringSessions WHERE status = 'completed'")
    const completedSessions = completedSessionsResult[0].count
    const participationRate = totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : 0

    // 3. Avg Feedback Score (from SessionFeedbacks, assuming we have a rating or analyzing text? 
    // The schema has 'rating' in TutorProfiles, but SessionFeedbacks has 'feedback_text'.
    // Wait, SessionFeedbacks table in create.sql doesn't have a numeric score?
    // Let's check create.sql again.
    // It has `title`, `feedback_text`, `takeaways`. No score.
    // But StudentScores has `score`.
    // Maybe "Avg Feedback Score" refers to Tutor ratings?
    // TutorProfiles has `rating`.
    // Let's use average tutor rating for now.
    const [avgRatingResult] = await pool.query('SELECT AVG(rating) as avg_rating FROM TutorProfiles')
    const avgFeedbackScore = avgRatingResult[0].avg_rating || 0

    // 4. Monthly Sessions Trend (Last 6 months)
    // Group by Month
    const [monthlyStats] = await pool.query(`
      SELECT 
        DATE_FORMAT(start_date, '%Y-%m') as month,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM TutoringSessions
      WHERE start_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `)

    res.status(200).json({
      totalSessions,
      participationRate,
      avgFeedbackScore,
      monthlyStats
    })
  } catch (error) {
    console.error('Get admin dashboard stats error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getReviews = async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT 
        sf.feedback_id as id,
        sf.title as sessionName,
        sf.feedback_text as feedback,
        sf.created_at as date,
        ts.subject,
        u_tutor.firstname as tutorFirstname,
        u_tutor.lastname as tutorLastname,
        u_tutor.avatar as tutorAvatar,
        u_student.firstname as studentFirstname,
        u_student.lastname as studentLastname,
        tp.rating as rating
      FROM SessionFeedbacks sf
      JOIN TutoringSessions ts ON sf.session_id = ts.session_id
      JOIN Users u_tutor ON ts.tutor_id = u_tutor.user_id
      JOIN Users u_student ON sf.student_id = u_student.user_id
      LEFT JOIN TutorProfiles tp ON u_tutor.user_id = tp.tutor_id
      ORDER BY sf.created_at DESC
    `)

    // Map to frontend format
    const formattedReviews = reviews.map(r => ({
      id: r.id,
      tutorName: `${r.tutorFirstname} ${r.tutorLastname}`,
      studentName: `${r.studentFirstname} ${r.studentLastname}`,
      sessionName: r.sessionName || r.subject, // Fallback to subject if title is null
      date: r.date,
      rating: r.rating || 0, // Use tutor rating as proxy or 0 if null
      subject: r.subject,
      feedback: r.feedback,
      status: 'published', // Default status
      avatarUrl: r.tutorAvatar,
      adminNotes: ''
    }))

    res.status(200).json(formattedReviews)
  } catch (error) {
    console.error('Get reviews error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

import * as ResourceModel from '../models/Resource.js'

export const getResources = async (req, res) => {
  try {
    const resources = await ResourceModel.getAllResources()

    const formattedResources = resources.map(r => ({
      id: r.resource_id,
      title: r.title,
      author: `${r.firstname} ${r.lastname}`,
      type: r.type,
      subject: r.subject,
      uploaded: r.created_at,
      status: r.status,
      image: r.image_url,
      views: r.views,
      isSaved: false, // Mock
      isMyUpload: false // Mock
    }))

    res.status(200).json(formattedResources)
  } catch (error) {
    console.error('Get resources error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getTutorApprovals = async (req, res) => {
  try {
    const [profiles] = await pool.query(`
      SELECT 
        tp.profile_id,
        tp.tutor_id,
        tp.biography,
        tp.faculty,
        tp.profile_status,
        u.firstname,
        u.lastname,
        u.avatar,
        u.email
      FROM TutorProfiles tp
      JOIN Users u ON tp.tutor_id = u.user_id
      ORDER BY tp.profile_id DESC
    `)

    // Fetch qualifications for each profile
    const formattedProfiles = await Promise.all(profiles.map(async (p) => {
      const [qualifications] = await pool.query('SELECT qualification FROM TutorQualifications WHERE tutor_id = ?', [p.tutor_id])
      
      // Mock changes list for now, as we don't track history of changes in DB yet
      // In a real app, we would have a ProfileChangeLog table
      const changes = qualifications.map(q => `Added qualification: ${q.qualification}`)
      if (p.biography) changes.push('Updated biography')

      return {
        id: p.profile_id,
        tutorId: p.tutor_id,
        name: `${p.firstname} ${p.lastname}`,
        role: p.faculty || 'Tutor',
        status: p.profile_status.charAt(0).toUpperCase() + p.profile_status.slice(1), // Capitalize
        avatar: p.avatar,
        submittedAt: 'Recently', // Mock
        changes: changes.length > 0 ? changes : ['Updated profile details'],
        email: p.email
      }
    }))

    res.status(200).json(formattedProfiles)
  } catch (error) {
    console.error('Get tutor approvals error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateTutorApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body // 'Approved', 'Rejected', 'Pending'

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const dbStatus = status.toLowerCase()

    await pool.query('UPDATE TutorProfiles SET profile_status = ? WHERE profile_id = ?', [dbStatus, id])

    res.status(200).json({ message: 'Status updated successfully' })
  } catch (error) {
    console.error('Update tutor approval status error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
