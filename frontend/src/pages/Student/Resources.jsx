import { useState } from 'react'
import Header from '../../components/Header/StudentHeader'
import Footer from '../../components/Footer/Footer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

// Icons
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import DownloadIcon from '@mui/icons-material/Download'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
// Upload dialog imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'

import { useStudentStore } from '../../stores/useStudentStore'
import { useEffect } from 'react'
import { format } from 'date-fns'
import DeleteIcon from '@mui/icons-material/Delete';

function Resources() {
  const { resources, fetchResources, toggleSaveResource } = useStudentStore()

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  const [selectedCategory, setSelectedCategory] = useState('All Resources')
  const [sortBy, setSortBy] = useState('Newest')

  // Upload state (local-only)
  const [openUpload, setOpenUpload] = useState(false)
  const [newResource, setNewResource] = useState({
    title: '',
    subject: '',
    type: 'PDF Document',
    visibility: 'Public',
    description: '',
    file: null,
  })
  const [myUploads, setMyUploads] = useState([])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewResource({ ...newResource, file: e.target.files[0] })
    }
  }

  const handleUpload = () => {
    if (!newResource.title || !newResource.subject || !newResource.file) {
      alert('Please fill in Title, Subject, and select a File.')
      return
    }
    const created = {
      id: Date.now(),
      title: newResource.title,
      author: 'You',
      type: newResource.type,
      subject: newResource.subject,
      uploaded: new Date().toISOString(),
      status: 'Approved',
      visibility: newResource.visibility,
      image: 'https://placehold.co/600x400/87CEEB/FFFFFF?text=New+File',
      isSaved: false,
      views: 0,
    }
    setMyUploads((prev) => [created, ...prev])
    setOpenUpload(false)
    setNewResource({ title: '', subject: '', type: 'PDF Document', visibility: 'Public', description: '', file: null })
  }

  // Filter States
  const [selectedSubjects, setSelectedSubjects] = useState({})
  const [selectedTypes, setSelectedTypes] = useState({})
  const [selectedStatuses, setSelectedStatuses] = useState({})

  // Handlers
  const handleSubjectChange = (event) => {
    setSelectedSubjects({ ...selectedSubjects, [event.target.name]: event.target.checked })
  }

  const handleTypeChange = (event) => {
    setSelectedTypes({ ...selectedTypes, [event.target.name]: event.target.checked })
  }

  const handleStatusChange = (event) => {
    setSelectedStatuses({ ...selectedStatuses, [event.target.name]: event.target.checked })
  }

  const handleClearFilters = () => {
    setSelectedSubjects({})
    setSelectedTypes({})
    setSelectedStatuses({})
  }

  // Filter Logic
  let filteredResources = [];
  if (selectedCategory === 'All Resources') {
    const mergedResources = [...myUploads, ...resources];
    filteredResources = mergedResources.filter((resource) => {
      const hasActiveSubjectFilter = Object.values(selectedSubjects).some(Boolean);
      const hasActiveTypeFilter = Object.values(selectedTypes).some(Boolean);
      const hasActiveStatusFilter = Object.values(selectedStatuses).some(Boolean);

      if (hasActiveSubjectFilter && !selectedSubjects[resource.subject]) return false;
      if (hasActiveTypeFilter && !selectedTypes[resource.type]) return false;
      if (hasActiveStatusFilter && !selectedStatuses[resource.status]) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.uploaded) - new Date(a.uploaded);
      } else if (sortBy === 'Oldest') {
        return new Date(a.uploaded) - new Date(b.uploaded);
      } else if (sortBy === 'Popular') {
        return b.views - a.views;
      }
      return 0;
    });
  } else if (selectedCategory === 'My Uploads') {
    filteredResources = myUploads.filter((resource) => {
      const hasActiveSubjectFilter = Object.values(selectedSubjects).some(Boolean);
      const hasActiveTypeFilter = Object.values(selectedTypes).some(Boolean);
      const hasActiveStatusFilter = Object.values(selectedStatuses).some(Boolean);

      if (hasActiveSubjectFilter && !selectedSubjects[resource.subject]) return false;
      if (hasActiveTypeFilter && !selectedTypes[resource.type]) return false;
      if (hasActiveStatusFilter && !selectedStatuses[resource.status]) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.uploaded) - new Date(a.uploaded);
      } else if (sortBy === 'Oldest') {
        return new Date(a.uploaded) - new Date(b.uploaded);
      } else if (sortBy === 'Popular') {
        return b.views - a.views;
      }
      return 0;
    });
  } else if (selectedCategory === 'My Collections') {
    const mergedResources = [...myUploads, ...resources];
    filteredResources = mergedResources.filter((resource) => resource.isSaved).sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.uploaded) - new Date(a.uploaded);
      } else if (sortBy === 'Oldest') {
        return new Date(a.uploaded) - new Date(b.uploaded);
      } else if (sortBy === 'Popular') {
        return b.views - a.views;
      }
      return 0;
    });
  }

  const handleToggleSave = (id) => {
    toggleSaveResource(id)
  }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Toolbar /> {/* Spacer for fixed header */}

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar */}
        <Box 
          sx={{ 
            width: 220, 
            flexShrink: 0, 
            bgcolor: 'background.default',
            borderRight: 1,
            borderColor: 'divider',
            display: { xs: 'none', md: 'block' }
          }}
        >
          <List component="nav" sx={{ pt: 3 }}>
            {['All Resources', 'My Uploads', 'My Collections'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton 
                  selected={selectedCategory === text}
                  onClick={() => setSelectedCategory(text)}
                  sx={{ 
                    pl: 3, 
                    py: 1.5,
                    borderLeft: selectedCategory === text ? 4 : 0,
                    borderColor: 'primary.main',
                    bgcolor: selectedCategory === text ? 'action.selected' : 'transparent'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: selectedCategory === text ? 'primary.main' : 'text.secondary' }}>
                    {index === 0 && <LibraryBooksIcon fontSize="small" />}
                    {index === 1 && <CloudUploadIcon fontSize="small" />}
                    {index === 2 && <CollectionsBookmarkIcon fontSize="small" />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.875rem',
                      fontWeight: selectedCategory === text ? 600 : 400,
                      color: selectedCategory === text ? 'primary.main' : 'text.primary'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Filters Column */}
        <Box sx={{ width: 245, flexShrink: 0, p: 4, borderRight: 1, borderColor: 'divider', bgcolor: 'background.default', display: { xs: 'none', md: 'block' } }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Filters</Typography>
          
          <Stack spacing={3}>
            {/* Subject Filter */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Subject</Typography>
              <Stack>
                {['Calculus', 'Computer Networks', 'Physics', 'Software Engineering'].map((label) => (
                  <FormControlLabel 
                    key={label} 
                    control={
                      <Checkbox 
                        size="small" 
                        name={label}
                        checked={selectedSubjects[label] || false}
                        onChange={handleSubjectChange}
                      />
                    } 
                    label={<Typography variant="body2">{label}</Typography>} 
                  />
                ))}
              </Stack>
            </Box>

            {/* Resource Type Filter */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Resource Type</Typography>
              <Stack>
                {['PDF Document', 'Video Lecture', 'Article'].map((label) => (
                  <FormControlLabel 
                    key={label} 
                    control={
                      <Checkbox 
                        size="small" 
                        name={label}
                        checked={selectedTypes[label] || false}
                        onChange={handleTypeChange}
                      />
                    } 
                    label={<Typography variant="body2">{label}</Typography>} 
                  />
                ))}
              </Stack>
            </Box>

            {/* Approval Status Filter */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Approval Status</Typography>
              <Stack>
                {['Approved', 'Pending Review'].map((label) => (
                  <FormControlLabel 
                    key={label} 
                    control={
                      <Checkbox 
                        size="small" 
                        name={label}
                        checked={selectedStatuses[label] || false}
                        onChange={handleStatusChange}
                      />
                    } 
                    label={<Typography variant="body2">{label}</Typography>} 
                  />
                ))}
              </Stack>
            </Box>

            <Button variant="outlined" fullWidth onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          {/* Top Bar */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {selectedCategory === 'All Resources' ? 'All Learning Resources' : selectedCategory}
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Upload Button */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenUpload(true)}
                sx={{ px: 3 }}
              >
                Upload Resource
              </Button>
              <Typography variant="body2" color="text.primary">Sort By:</Typography>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
                sx={{ minWidth: 150, bgcolor: 'background.paper' }}
              >
                <MenuItem value="Newest">Newest</MenuItem>
                <MenuItem value="Oldest">Oldest</MenuItem>
                <MenuItem value="Popular">Most Popular</MenuItem>
              </Select>
            </Stack>
          </Stack>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {filteredResources.length === 0 ? (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  {selectedCategory === 'My Collections' 
                    ? "You haven't saved any resources yet." 
                    : "No resources found matching your criteria."}
                </Typography>
              </Box>
            ) : (
              filteredResources.map((resource) => (
              <Card key={resource.id} sx={{ width: 310, display: 'flex', flexDirection: 'column', height: 450, borderRadius: 2}}>
                <CardMedia
                  component="img"
                  height="180"
                  image={resource.image}
                  alt={resource.title}
                />
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    By {resource.author}
                  </Typography>
                  
                  <Stack spacing={0.5} sx={{ mt: 2 }}>
                    <Typography variant="caption" display="block">
                      <strong>Type:</strong> {resource.type}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Subject:</strong> {resource.subject}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Uploaded:</strong> {resource.uploaded ? format(new Date(resource.uploaded), 'dd/MM/yyyy') : 'N/A'}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Views:</strong> {resource.views}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                      <Typography variant="caption"><strong>Status:</strong></Typography>
                      <Chip 
                        label={resource.status} 
                        size="small" 
                        color={resource.status === 'Approved' ? 'primary' : 'secondary'}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', px: 1, py: 1.5 }}>
                  <Button size="small" startIcon={<DownloadIcon />} color="inherit">
                    Download
                  </Button>
                  {myUploads.some((item) => item.id === resource.id) ? (
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => setMyUploads(myUploads.filter((item) => item.id !== resource.id))}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Button 
                      size="small" 
                      startIcon={resource.isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />} 
                      color={resource.isSaved ? "primary" : "inherit"}
                      onClick={() => handleToggleSave(resource.id)}
                    >
                      {resource.isSaved ? "Saved" : "Save"}
                    </Button>
                  )}
                  <Button size="small" startIcon={<VisibilityIcon />} color="inherit">
                    Preview
                  </Button>
                </CardActions>
              </Card>
            )))}
          </Box>
        </Box>
      </Box>

      {/* Upload Dialog */}
      <Dialog open={openUpload} onClose={() => setOpenUpload(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Resource</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} fullWidth sx={{ height: 80, borderStyle: 'dashed' }}>
              {newResource.file ? newResource.file.name : 'Select File (PDF, Video, PPT)'}
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            <TextField label="Resource Title" fullWidth required value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} />
            <Stack direction="row" spacing={2}>
              <TextField label="Subject" select fullWidth required value={newResource.subject} onChange={(e) => setNewResource({ ...newResource, subject: e.target.value })}>
                <MenuItem value="Calculus">Calculus</MenuItem>
                <MenuItem value="Computer Networks">Computer Networks</MenuItem>
                <MenuItem value="Physics">Physics</MenuItem>
                <MenuItem value="Software Engineering">Software Engineering</MenuItem>
              </TextField>
              <TextField label="Type" select fullWidth value={newResource.type} onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}>
                <MenuItem value="PDF Document">PDF Document</MenuItem>
                <MenuItem value="Video Lecture">Video Lecture</MenuItem>
                <MenuItem value="Article">Article</MenuItem>
              </TextField>
            </Stack>
            <TextField label="Visibility" select fullWidth value={newResource.visibility} onChange={(e) => setNewResource({ ...newResource, visibility: e.target.value })} helperText="Who can view this resource?">
              <MenuItem value="Public">Public (Everyone)</MenuItem>
              <MenuItem value="Class Only">Class Only</MenuItem>
              <MenuItem value="Private">Private</MenuItem>
            </TextField>
            <TextField label="Description / Tags" multiline rows={3} fullWidth value={newResource.description} onChange={(e) => setNewResource({ ...newResource, description: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpload(false)}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained" disabled={!newResource.file}>Publish</Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}

export default Resources