import React, { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'

// Sample data remains the same
const rows = [
  { id: 1, name: 'John', age: 25, country: 'USA' },
  { id: 2, name: 'Alice', age: 30, country: 'UK' },
  { id: 3, name: 'Bob', age: 35, country: 'Canada' },
  { id: 4, name: 'Charlie', age: 40, country: 'Australia' },
]

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

const columns = [
  { label: 'ID', value: 'id' },
  { label: 'Name', value: 'name' },
  { label: 'Age', value: 'age' },
  { label: 'Country', value: 'country' },
]

const MultiFilterTable = () => {
  const [filters, setFilters] = useState([{ column: '', operator: '', value: '', condition: '' }])
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

  // Fixed filter logic
  const applyFilters = (rows) => {
    return rows.filter((row) => {
      return filters.every((filter, index) => {
        if (!filter.column || !filter.operator) return true

        const cellValue = String(row[filter.column]).toLowerCase()
        const filterValue = filter.value?.toLowerCase() || ''

        let previousResult = true
        if (index > 0) {
          const prevFilter = filters[index - 1]
          const prevCellValue = String(row[prevFilter.column]).toLowerCase()
          previousResult = evaluateFilter(prevFilter, prevCellValue)
        }

        const currentResult = evaluateFilter(filter, cellValue)

        return index === 0
          ? currentResult
          : filter.condition === 'AND'
            ? previousResult && currentResult
            : previousResult || currentResult
      })
    })
  }

  const evaluateFilter = (filter, cellValue) => {
    const filterValue = filter.value?.toLowerCase() || ''

    switch (filter.operator) {
      case 'contains':
        return cellValue.includes(filterValue)
      case 'not_contains':
        return !cellValue.includes(filterValue)
      case 'equals':
        return cellValue === filterValue
      case 'not_equals':
        return cellValue !== filterValue
      case 'starts_with':
        return cellValue.startsWith(filterValue)
      case 'ends_with':
        return cellValue.endsWith(filterValue)
      case 'is_empty':
        return cellValue === ''
      case 'is_not_empty':
        return cellValue !== ''
      case 'is_any_of':
        const values = filterValue.split(',').map((v) => v.trim().toLowerCase())
        return values.includes(cellValue)
      default:
        return true
    }
  }

  const filteredRows = applyFilters(rows)

  return (
    <div style={{ padding: '1rem', position: 'relative' }}>
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

      <Card>
        <CardContent style={{ padding: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Country</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>{row.country}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default MultiFilterTable
