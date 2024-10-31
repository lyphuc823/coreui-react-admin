import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CCarousel,
  CCarouselItem,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CImage,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import data from '../../data/employee.json'
import FilterComponent from '../../../../components/multi-filter'

EmployeeList.propTypes = {}

function EmployeeList(props) {
  const [employees, setEmployees] = useState([])
  const { enqueueSnackbar } = useSnackbar() // Notification state

  useEffect(() => {
    setEmployees(data)
  }, [])

  return (
    <CContainer fluid className="py-4" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
      <CRow className="mb-4 align-items-center">
        <CCol>
          <h1 style={{ fontWeight: 'bold' }}>Employee Management</h1>
        </CCol>
      </CRow>
      <CCard className="mb-4" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: 'none' }}>
        <CCardBody>
          <CRow className="justify-content-between align-items-center">
            {/* Gender Filter Select */}
            <CCol xs="auto" className="d-flex">
              <Link to="/employee/add">
                <CButton color="info">Add</CButton>
              </Link>
              <CContainer>
                <FilterComponent columns={columns} filters={filters} setFilters={setFilters} />
              </CContainer>
            </CCol>
            <CCol xs="auto" className="d-flex justify-content-end">
              <CRow className="align-items-center">
                <CCol xs="auto">
                  <CFormInput type="file" id="formFile" />
                </CCol>
              </CRow>
            </CCol>
          </CRow>

          <CRow className="g-3">
            {filteredEmployees.map((employee) => (
              <CCol xs="12" sm="6" md="6" lg="3" key={employee.id}>
                <CCard>
                  <CCarousel transition="crossfade" interval={1000} wrap>
                    {employee.images.map((image, index) => (
                      <CCarouselItem key={index}>
                        <CImage
                          src={image.url}
                          alt={`${employee.name} - ${index}`}
                          fluid
                          className="mb-2"
                          width={400}
                          height={400}
                          thumbnail
                          align="center"
                        />
                      </CCarouselItem>
                    ))}
                  </CCarousel>

                  <CCardBody>
                    <CCardTitle>
                      <Link
                        to={`/employee/${employee.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {employee.name}{' '}
                      </Link>
                    </CCardTitle>
                    <CCardText>Start Date: {employee.startDate}</CCardText>
                    <CCardText>Status: {employee.endDate ? 'Unavailable' : 'Available'}</CCardText>

                    <Link to={`/employee/${employee.id}/edit`}>
                      <CButton color="warning" size="sm" className="me-2 text-white">
                        Edit
                      </CButton>
                    </Link>
                    <Link to="#">
                      <CButton
                        color="danger"
                        size="sm"
                        className="me-2 text-white"
                        onClick={() => openDeleteModal(employee.id)} // Call delete handler
                      >
                        Delete
                      </CButton>
                    </Link>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default EmployeeList
