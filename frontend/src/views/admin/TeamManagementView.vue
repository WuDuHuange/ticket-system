<template>
  <div class="team-management-view">
    <div class="page-header">
      <h1>{{ $t('nav.teamManagement') }}</h1>
      <el-button type="primary" @click="showAddTeam">
        <el-icon><Plus /></el-icon>
        {{ $t('admin.addTeam') }}
      </el-button>
    </div>

    <!-- Teams Grid -->
    <el-row :gutter="20" v-loading="loading">
      <el-col :xs="24" :sm="12" :lg="8" v-for="team in teams" :key="team.id">
        <el-card class="team-card">
          <div class="team-header">
            <div class="team-icon">
              <el-icon :size="32"><UserFilled /></el-icon>
            </div>
            <div class="team-info">
              <h3>{{ team.name }}</h3>
              <span class="member-count">{{ team.memberCount }} {{ $t('admin.teamMembers') }}</span>
            </div>
            <el-dropdown trigger="click">
              <el-button text>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="editTeam(team)">
                    <el-icon><Edit /></el-icon>
                    {{ $t('common.edit') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="manageMembers(team)">
                    <el-icon><User /></el-icon>
                    {{ $t('admin.manageMembers') }}
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="deleteTeam(team)">
                    <el-icon><Delete /></el-icon>
                    {{ $t('common.delete') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          
          <p class="team-description">{{ team.description || $t('admin.noDescription') }}</p>
          
          <div class="team-members">
            <el-avatar
              v-for="member in team.members?.slice(0, 5)"
              :key="member.id"
              :size="32"
              class="member-avatar"
            >
              {{ getInitials(member.userName) }}
            </el-avatar>
            <el-avatar v-if="team.memberCount > 5" :size="32" class="member-avatar more">
              +{{ team.memberCount - 5 }}
            </el-avatar>
          </div>
          
          <div class="team-footer">
            <span class="created-date">{{ $t('admin.createdDate') }} {{ formatDate(team.createdAt) }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Add Team Dialog -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? $t('admin.editTeam') : $t('admin.addTeam')" width="500px">
      <el-form :model="teamForm" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item :label="$t('common.name')" prop="name">
          <el-input v-model="teamForm.name" :placeholder="$t('admin.enterTeamName')" />
        </el-form-item>
        
        <el-form-item :label="$t('common.description')" prop="description">
          <el-input
            v-model="teamForm.description"
            type="textarea"
            :rows="3"
            :placeholder="$t('admin.enterTeamDescription')"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitTeam" :loading="submitting">
          {{ isEditing ? $t('admin.updateTeam') : $t('admin.createTeam') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Manage Members Dialog -->
    <el-dialog v-model="membersDialogVisible" :title="$t('admin.manageMembers') + ' - ' + selectedTeam?.name" width="600px">
      <div class="members-dialog">
        <div class="add-member-section">
          <el-select
            v-model="selectedUserId"
            :placeholder="$t('admin.selectUser')"
            filterable
            style="width: 300px"
          >
            <el-option
              v-for="user in availableUsers"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
          <el-button type="primary" @click="addMember" :disabled="!selectedUserId">
            {{ $t('admin.addMember') }}
          </el-button>
        </div>
        
        <el-divider />
        
        <div class="members-list">
          <h4>{{ $t('admin.currentMembers') }}</h4>
          <el-table :data="teamMembers" v-loading="membersLoading">
            <el-table-column prop="userName" :label="$t('common.name')" />
            <el-table-column prop="role" :label="$t('admin.memberRole')" width="150">
              <template #default="{ row }">
                <el-tag size="small">{{ row.role || 'Member' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.actions')" width="100">
              <template #default="{ row }">
                <el-button text type="danger" @click="removeMember(row)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="membersDialogVisible = false">{{ $t('common.close') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores'
import { teamApi } from '@/api'
import type { Team } from '@/types'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { formatDate } from '@/utils/helpers'
import { Plus, UserFilled, MoreFilled, Edit, User, Delete } from '@element-plus/icons-vue'

const { t } = useI18n()
const uiStore = useUIStore()

const loading = ref(false)
const submitting = ref(false)
const teams = ref<Team[]>([])

const dialogVisible = ref(false)
const isEditing = ref(false)
const formRef = ref<FormInstance>()
const teamForm = reactive({
  id: '',
  name: '',
  description: ''
})

// Members dialog state
const membersDialogVisible = ref(false)
const membersLoading = ref(false)
const selectedTeam = ref<Team | null>(null)
const teamMembers = ref<any[]>([])
const availableUsers = ref<any[]>([])
const selectedUserId = ref('')

const rules: FormRules = {
  name: [
    { required: true, message: () => t('admin.teamNameRequired'), trigger: 'blur' }
  ]
}

onMounted(async () => {
  uiStore.setBreadcrumbs([
    { label: t('nav.administration') },
    { label: t('nav.teamManagement') }
  ])
  
  await loadTeams()
})

async function loadTeams() {
  loading.value = true
  
  try {
    const response = await teamApi.getTeams()
    
    if (response.code === 200 && response.data) {
      teams.value = response.data
    }
  } catch (error) {
    console.error('Failed to load teams:', error)
  } finally {
    loading.value = false
  }
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function showAddTeam() {
  isEditing.value = false
  teamForm.id = ''
  teamForm.name = ''
  teamForm.description = ''
  dialogVisible.value = true
}

function editTeam(team: Team) {
  isEditing.value = true
  teamForm.id = team.id
  teamForm.name = team.name
  teamForm.description = team.description || ''
  dialogVisible.value = true
}

async function manageMembers(team: Team) {
  selectedTeam.value = team
  membersDialogVisible.value = true
  membersLoading.value = true
  
  try {
    // Load team members
    teamMembers.value = team.members || []
    
    // Load available users (mock data for now)
    availableUsers.value = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Bob Wilson' },
      { id: '4', name: 'Alice Brown' }
    ]
  } catch (error) {
    console.error('Failed to load members:', error)
    ElMessage.error(t('messages.loadFailed'))
  } finally {
    membersLoading.value = false
  }
}

function addMember() {
  if (!selectedUserId.value || !selectedTeam.value) return
  
  const user = availableUsers.value.find(u => u.id === selectedUserId.value)
  if (user) {
    teamMembers.value.push({
      id: user.id,
      userName: user.name,
      role: 'Member'
    })
    selectedUserId.value = ''
    ElMessage.success(t('admin.memberAdded'))
  }
}

function removeMember(member: any) {
  teamMembers.value = teamMembers.value.filter(m => m.id !== member.id)
  ElMessage.success(t('admin.memberRemoved'))
}

async function deleteTeam(team: Team) {
  try {
    await ElMessageBox.confirm(
      `${t('admin.confirmDeleteTeam')} "${team.name}"?`,
      t('admin.deleteTeam'),
      { type: 'warning' }
    )
    
    ElMessage.success(t('admin.teamDeleted'))
  } catch {
    // User cancelled
  }
}

async function submitTeam() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    
    try {
      if (isEditing.value) {
        const response = await teamApi.updateTeam(teamForm.id, {
          name: teamForm.name,
          description: teamForm.description
        })
        
        if (response.code === 200) {
          ElMessage.success(t('admin.teamUpdated'))
          await loadTeams()
        }
      } else {
        const response = await teamApi.createTeam({
          name: teamForm.name,
          description: teamForm.description
        })
        
        if (response.code === 200) {
          ElMessage.success(t('admin.teamCreated'))
          await loadTeams()
        }
      }
      
      dialogVisible.value = false
    } catch (error) {
      console.error('Failed to save team:', error)
      ElMessage.error('Failed to save team')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.team-management-view {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
  }
  
  .el-col {
    margin-bottom: 20px;
  }
  
  .team-card {
    height: 100%;
    
    .team-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      
      .team-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ecf5ff;
        border-radius: 12px;
        color: #409eff;
      }
      
      .team-info {
        flex: 1;
        
        h3 {
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 600;
        }
        
        .member-count {
          font-size: 13px;
          color: #999;
        }
      }
    }
    
    .team-description {
      margin: 0 0 16px;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
    
    .team-members {
      display: flex;
      margin-bottom: 16px;
      
      .member-avatar {
        margin-left: -8px;
        border: 2px solid #fff;
        
        &:first-child {
          margin-left: 0;
        }
        
        &.more {
          background: #e4e7ed;
          color: #909399;
          font-size: 12px;
        }
      }
    }
    
    .team-footer {
      padding-top: 12px;
      border-top: 1px solid #eee;
      
      .created-date {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
