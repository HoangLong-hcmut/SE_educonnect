import { useState, useEffect } from 'react'
import Header from '../../components/Header/TutorHeader'
import Footer from '../../components/Footer/Footer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Divider from '@mui/material/Divider'

// Icons
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'

import { useTutorStore } from '../../stores/useTutorStore'

function Profile() {
  const { profile, fetchProfile, updateProfile } = useTutorStore()

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Placeholder State
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    biography: '',
    isPaused: false
  })

  const [expertiseList, setExpertiseList] = useState([])
  const [newExpertise, setNewExpertise] = useState('')

  const [subjectList, setSubjectList] = useState([])
  const [newSubject, setNewSubject] = useState('')

  const [qualifications, setQualifications] = useState([])
  const [newQualification, setNewQualification] = useState('')

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: `${profile.firstname} ${profile.lastname}`,
        email: profile.email,
        biography: profile.biography || '',
        isPaused: !!profile.is_paused
      })
      setExpertiseList(profile.expertise || [])
      setSubjectList(profile.subjects || [])
      setQualifications(profile.qualifications || [])
    }
  }, [profile])

  // Backup state for cancel functionality
  const [backupData, setBackupData] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (e) => {
    setFormData(prev => ({ ...prev, isPaused: e.target.checked }))
  }

  const handleAddExpertise = () => {
    if (newExpertise.trim()) {
      setExpertiseList([...expertiseList, newExpertise.trim()])
      setNewExpertise('')
    }
  }

  const handleDeleteExpertise = (chipToDelete) => {
    setExpertiseList((chips) => chips.filter((chip) => chip !== chipToDelete))
  }

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      setSubjectList([...subjectList, newSubject.trim()])
      setNewSubject('')
    }
  }

  const handleDeleteSubject = (chipToDelete) => {
    setSubjectList((chips) => chips.filter((chip) => chip !== chipToDelete))
  }

  const handleAddQualification = () => {
    if (newQualification.trim()) {
      setQualifications([...qualifications, newQualification.trim()])
      setNewQualification('')
    }
  }

  const handleDeleteQualification = (indexToDelete) => {
    setQualifications((quals) => quals.filter((_, index) => index !== indexToDelete))
  }

  const handleStartEdit = () => {
    setBackupData({
      formData: { ...formData },
      expertiseList: [...expertiseList],
      subjectList: [...subjectList],
      qualifications: [...qualifications]
    })
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    if (backupData) {
      setFormData(backupData.formData)
      setExpertiseList(backupData.expertiseList)
      setSubjectList(backupData.subjectList)
      setQualifications(backupData.qualifications)
    }
    setIsEditing(false)
    setBackupData(null)
  }

  const handleSaveEdit = async () => {
    await updateProfile({
      biography: formData.biography,
      isPaused: formData.isPaused,
      expertise: expertiseList,
      subjects: subjectList,
      qualifications: qualifications
    })
    setIsEditing(false)
    setBackupData(null)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Toolbar /> {/* Spacer for fixed header */}
      
      <Container maxWidth={false} sx={{ maxWidth: '1350px', py: 4, flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            My Profile
          </Typography>
          <Stack direction="row" spacing={2}>
            {isEditing && (
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            )}
            <Button 
              variant="contained" 
              startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
              onClick={isEditing ? handleSaveEdit : handleStartEdit}
              color={isEditing ? "success" : "primary"}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </Stack>
        </Stack>

        {/* Section 1: My Profile Details */}
        <Paper sx={{ py: 2, px: 4, mb: 4, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Profile Details
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update your personal information and expertise.
          </Typography>

          <Stack spacing={4}>
            <Grid container spacing={{ xs: 2, md: 10 }}>
              {/* Avatar Section */}
              <Grid item xs={12} sm={4} md={2}>
                <Stack direction="column" spacing={2} alignItems="center">
                  <Avatar
                    src="/placeholder-avatar.jpg"
                    sx={{ width: 150, height: 150 }}
                  />
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mb: 1, textTransform: 'none' }}
                    >
                      Change Avatar
                      <input type="file" hidden accept="image/png, image/jpeg" />
                    </Button>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Image must be a JPG or PNG, max 2MB.
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Full Name */}
              <Grid item xs={12} sm={4} md={5}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="fullName"
                  value={formData.fullName}
                  slotProps={{ input: { readOnly: true } }}
                  helperText="Changes to your name must be done via HCMUT SSO."
                />
              </Grid>

              {/* Email Address */}
              <Grid item xs={12} sm={4} md={5}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  slotProps={{ input: { readOnly: true } }}
                  helperText="Your email is linked to your HCMUT SSO account."
                />
              </Grid>
            </Grid>

            {/* Biography */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Biography
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                slotProps={{ input: isEditing ? { readOnly: false } : { readOnly: true } }}
                placeholder="Tell students about your teaching style and experience..."
              />
            </Box>

            {/* Areas of Expertise */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Areas of Expertise
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {expertiseList.map((data) => (
                  <Chip
                    key={data}
                    label={data}
                    onDelete={isEditing ? () => handleDeleteExpertise(data) : undefined}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
              {isEditing && (
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a new expertise (e.g., Data Science)"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddExpertise();
                      }
                    }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleAddExpertise}
                    sx={{ minWidth: 100 }}
                  >
                    Add
                  </Button>
                </Stack>
              )}
            </Box>

            {/* Subjects Taught */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Subjects Taught
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {subjectList.map((data) => (
                  <Chip
                    key={data}
                    label={data}
                    onDelete={isEditing ? () => handleDeleteSubject(data) : undefined}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
              {isEditing && (
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a new subject (e.g., Chemistry)"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubject();
                      }
                    }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleAddSubject}
                    sx={{ minWidth: 100 }}
                  >
                    Add
                  </Button>
                </Stack>
              )}
            </Box>
          </Stack>
        </Paper>

        {/* Section 2: Qualifications & Experience */}
        <Paper sx={{ py: 2, px: 4, mb: 4, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Qualifications & Experience
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            List your academic degrees, certifications, and relevant achievements.
          </Typography>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {qualifications.map((qual, index) => (
              <Paper 
                key={index} 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  bgcolor: 'background.paper'
                }}
              >
                <Typography variant="body1">{qual}</Typography>
                {isEditing && (
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteQualification(index)}
                    size="small"
                    sx={{ 
                      bgcolor: 'error.main', 
                      color: 'white',
                      '&:hover': { bgcolor: 'error.dark' },
                      borderRadius: 1
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Paper>
            ))}
          </Stack>

          {isEditing && (
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                size="small"
                placeholder="Add a new qualification or achievement"
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddQualification();
                  }
                }}
              />
              <IconButton 
                color="primary" 
                onClick={handleAddQualification}
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  borderRadius: 1,
                  width: 40,
                  height: 40
                }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          )}
        </Paper>

        {/* Section 3: Profile Status & Actions */}
        <Paper sx={{  py: 2, px: 4, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Profile Status
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manage your profile visibility and submit changes for review.
          </Typography>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Pause Profile
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                When paused, your profile will not appear in tutor search results.
              </Typography>
              <Switch
                checked={formData.isPaused}
                onChange={handleSwitchChange}
                disabled={!isEditing}
                inputProps={{ 'aria-label': 'pause profile' }}
              />
            </Stack>
          </Box>
        </Paper>

      </Container>
      <Footer />
    </Box>
  )
}

export default Profile