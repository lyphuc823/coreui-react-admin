import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import FilterComponent from '../component/MultipleFilter' // Import the filter component

// Sample data remains the same
const rows = [
  { id: 1, name: 'John', age: 25, country: 'USA' },
  { id: 2, name: 'Alice', age: 30, country: 'UK' },
  { id: 3, name: 'Bob', age: 35, country: 'Canada' },
  { id: 4, name: 'Charlie', age: 40, country: 'Australia' },
]

const columns = [
  { label: 'ID', value: 'id' },
  { label: 'Name', value: 'name' },
  { label: 'Age', value: 'age' },
  { label: 'Country', value: 'country' },
]

const MultiFilterTable = () => {
  const [filters, setFilters] = useState([{ column: '', operator: '', value: '', condition: '' }])

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
      {/* Filter Component */}
      <FilterComponent columns={columns} filters={filters} setFilters={setFilters} />

      {/* Table Display */}
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
