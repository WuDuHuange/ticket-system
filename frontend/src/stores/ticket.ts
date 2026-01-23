import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ticket, TicketCategory, PaginatedResponse, TicketCreateDTO } from '@/types'
import { ticketApi } from '@/api'

export const useTicketStore = defineStore('ticket', () => {
  // State
  const tickets = ref<Ticket[]>([])
  const currentTicket = ref<Ticket | null>(null)
  const categories = ref<TicketCategory[]>([])
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })
  const loading = ref(false)
  const filter = ref<Record<string, unknown>>({})

  // Getters
  const ticketCount = computed(() => tickets.value.length)
  const newTickets = computed(() => tickets.value.filter(t => t.status === 'new'))
  const openTickets = computed(() => tickets.value.filter(t => 
    ['new', 'assigned', 'in_progress', 'pending_user'].includes(t.status)
  ))
  const resolvedTickets = computed(() => tickets.value.filter(t => 
    ['resolved', 'closed'].includes(t.status)
  ))

  // Actions
  async function fetchTickets(page = 1, pageSize = 10, filterParams?: Record<string, unknown>) {
    loading.value = true
    try {
      const mergedFilter = { ...filter.value, ...filterParams }
      // Assuming api expects filter object structure or specific params
      const response = await ticketApi.getTickets({ page, pageSize, filter: mergedFilter })
      
      if (response.code === 200 && response.data) {
        const data = response.data as PaginatedResponse<Ticket>
        tickets.value = data.items
        pagination.value = {
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages
        }
      }
    } catch (error) {
      console.error('Fetch tickets error:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchMyTickets(page = 1, pageSize = 10, status?: string) {
    loading.value = true
    try {
      const response = await ticketApi.getMyTickets({ page, pageSize, status })
      
      if (response.code === 200 && response.data) {
        const data = response.data as PaginatedResponse<Ticket>
        tickets.value = data.items
        pagination.value = {
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages
        }
      }
    } catch (error) {
      console.error('Fetch my tickets error:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchAssignedTickets(page = 1, pageSize = 10, status?: string) {
    loading.value = true
    try {
      const response = await ticketApi.getAssignedTickets({ page, pageSize, status })
      
      if (response.code === 200 && response.data) {
        const data = response.data as PaginatedResponse<Ticket>
        tickets.value = data.items
        pagination.value = {
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages
        }
      }
    } catch (error) {
      console.error('Fetch assigned tickets error:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchTicketById(id: string) {
    loading.value = true
    try {
      const response = await ticketApi.getTicketById(id)
      
      if (response.code === 200 && response.data) {
        currentTicket.value = response.data
        return response.data
      }
      return null
    } catch (error) {
      console.error('Fetch ticket error:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createTicket(data: Record<string, unknown>) {
    loading.value = true
    try {
      // Cast to TicketCreateDTO
      const response = await ticketApi.createTicket(data as unknown as TicketCreateDTO)
      
      if (response.code === 200 && response.data) {
        return { success: true, ticket: response.data }
      }
      return { success: false, message: response.message }
    } catch (error) {
      console.error('Create ticket error:', error)
      return { success: false, message: 'Failed to create ticket' }
    } finally {
      loading.value = false
    }
  }

  async function updateTicketStatus(id: string, status: string, comment?: string) {
    loading.value = true
    try {
      const response = await ticketApi.updateTicketStatus(id, status, comment)
      
      if (response.code === 200 && response.data) {
        currentTicket.value = response.data
        // Update in list if exists
        const index = tickets.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tickets.value[index] = response.data
        }
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      console.error('Update ticket status error:', error)
      return { success: false, message: 'Failed to update ticket status' }
    } finally {
      loading.value = false
    }
  }

  async function assignTicket(id: string, assigneeId: string) {
    loading.value = true
    try {
      const response = await ticketApi.assignTicket(id, assigneeId)

      if (response.code === 200 && response.data) {
        currentTicket.value = response.data
        const index = tickets.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tickets.value[index] = response.data
        }
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      console.error('Assign ticket error:', error)
      return { success: false, message: 'Failed to assign ticket' }
    } finally {
      loading.value = false
    }
  }

  async function assignTicketToTeam(id: string, teamId: string) {
    loading.value = true
    try {
      const response = await ticketApi.assignTicketToTeam(id, teamId)

      if (response.code === 200 && response.data) {
        currentTicket.value = response.data
        const index = tickets.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tickets.value[index] = response.data
        }
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      console.error('Assign ticket to team error:', error)
      return { success: false, message: 'Failed to assign ticket to team' }
    } finally {
      loading.value = false
    }
  }

  async function addComment(ticketId: string, content: string, isInternal = false) {
    loading.value = true
    try {
      const response = await ticketApi.addComment(ticketId, { content, isInternal })
      
      if (response.code === 200 && response.data) {
        // Refresh current ticket to get updated comments
        await fetchTicketById(ticketId)
        return { success: true, comment: response.data }
      }
      return { success: false, message: response.message }
    } catch (error) {
      console.error('Add comment error:', error)
      return { success: false, message: 'Failed to add comment' }
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const response = await ticketApi.getCategories()
      
      if (response.code === 200 && response.data) {
        categories.value = response.data
      }
    } catch (error) {
      console.error('Fetch categories error:', error)
    }
  }

  async function submitSatisfaction(ticketId: string, rating: number, comment?: string) {
    loading.value = true
    try {
      const response = await ticketApi.submitFeedback(ticketId, { rating, comment })
      
      if (response.code === 200) {
        // Refresh current ticket to get updated satisfaction data
        await fetchTicketById(ticketId)
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      console.error('Submit satisfaction error:', error)
      return { success: false, message: 'Failed to submit satisfaction feedback' }
    } finally {
      loading.value = false
    }
  }

  function setFilter(newFilter: Record<string, unknown>) {
    filter.value = newFilter
  }

  function clearFilter() {
    filter.value = {}
  }

  return {
    // State
    tickets,
    currentTicket,
    categories,
    pagination,
    loading,
    filter,
    // Getters
    ticketCount,
    newTickets,
    openTickets,
    resolvedTickets,
    // Actions
    fetchTickets,
    fetchMyTickets,
    fetchAssignedTickets,
    fetchTicketById,
    createTicket,
    updateTicketStatus,
    assignTicket,
    assignTicketToTeam,
    addComment,
    fetchCategories,
    submitSatisfaction,
    setFilter,
    clearFilter
  }
})
