/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Button, Paper, Select, MenuItem, TextField, IconButton } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'

const operators = [
  { label: 'contains', value: 'contains' },
  { label: 'does not contain', value: 'not_contains' },
  { label: 'equals', value: 'equals' },
  { label: 'does not equal', value: 'not_equals' },
  { label: 'starts with', value: 'starts_with' },
  { label: 'ends with', value: 'ends_with' },
  { label: 'is empty', value: 'is_empty' },
  { label: 'is not empty', value: 'is_not_empty' },
  { label: 'is any of', value: 'is_any_of' },
]

const FilterComponent = ({ columns, filters, setFilters }) => {
  const [showFilters, setShowFilters] = useState(false)

  const handleAddFilter = () => {
    setFilters([...filters, { column: '', operator: '', value: '', condition: 'AND' }])
  }

  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index)
    setFilters(newFilters)
  }

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters]
    newFilters[index][field] = value
    setFilters(newFilters)
  }

  const handleRemoveAll = () => {
    setFilters([{ column: '', operator: '', value: '', condition: '' }])
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Button
          variant="outlined"
          onClick={() => setShowFilters(!showFilters)}
          startIcon={<FilterAltIcon />}
        >
          Filters
        </Button>
      </div>

      {showFilters && (
        <Paper
          elevation={3}
          style={{
            position: 'absolute',
            zIndex: 10,
            left: '1rem',
            right: '1rem',
            padding: '1rem',
            maxWidth: '30rem',
            backgroundColor: 'white',
          }}
        >
          <div>
            {filters.map((filter, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                {index > 0 && (
                  <Select
                    value={filter.condition}
                    onChange={(e) => handleFilterChange(index, 'condition', e.target.value)}
                    size="small"
                    style={{ width: '100px' }}
                  >
                    <MenuItem value="AND">AND</MenuItem>
                    <MenuItem value="OR">OR</MenuItem>
                  </Select>
                )}

                <Select
                  value={filter.column}
                  onChange={(e) => handleFilterChange(index, 'column', e.target.value)}
                  size="small"
                  style={{ width: '120px' }}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>Column</em>
                    }
                    return columns.find((col) => col.value === selected)?.label
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Column</em>
                  </MenuItem>
                  {columns.map((col) => (
                    <MenuItem key={col.value} value={col.value}>
                      {col.label}
                    </MenuItem>
                  ))}
                </Select>

                <Select
                  value={filter.operator}
                  onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                  size="small"
                  style={{ width: '140px' }}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>Operator</em>
                    }
                    return operators.find((op) => op.value === selected)?.label
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Operator</em>
                  </MenuItem>
                  {operators.map((op) => (
                    <MenuItem key={op.value} value={op.value}>
                      {op.label}
                    </MenuItem>
                  ))}
                </Select>

                <TextField
                  size="small"
                  style={{ width: '140px' }}
                  placeholder="Filter value"
                  value={filter.value}
                  onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                  disabled={filter.operator === 'is_empty' || filter.operator === 'is_not_empty'}
                />

                <IconButton size="small" onClick={() => handleRemoveFilter(index)}>
                  <CloseIcon />
                </IconButton>
              </div>
            ))}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddFilter}
                startIcon={<AddIcon />}
              >
                Add Filter
              </Button>

              <Button variant="text" size="small" onClick={handleRemoveAll} color="inherit">
                Remove All
              </Button>
            </div>
          </div>
        </Paper>
      )}
    </div>
  )
}

export default FilterComponent
