<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getProductUserList,
  updateUserPoints,
  updateUserVip,
  updateUserStatus
} from "@/api/product";

defineOptions({ name: "ProductUser" });

const loading = ref(false);
const dataList = ref<any[]>([]);
const total = ref(0);

const form = reactive({
  nickName: "",
  mobile: "",
  subscribeStatus: undefined as number | undefined
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 10
});

const pointsDialog = reactive({
  visible: false,
  userId: 0,
  delta: 0,
  remark: ""
});

async function fetchData() {
  loading.value = true;
  try {
    const res = await getProductUserList({
      ...form,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    if (res.code === 0 && res.data) {
      dataList.value = res.data.list || [];
      total.value = res.data.total || 0;
    }
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.currentPage = 1;
  fetchData();
}

function handleReset() {
  form.nickName = "";
  form.mobile = "";
  form.subscribeStatus = undefined;
  handleSearch();
}

function openPointsDialog(row: any) {
  pointsDialog.userId = row.id;
  pointsDialog.delta = 0;
  pointsDialog.remark = "";
  pointsDialog.visible = true;
}

async function confirmPoints() {
  if (pointsDialog.delta === 0) {
    ElMessage.warning("积分变化量不能为 0");
    return;
  }
  const res = await updateUserPoints({
    userId: pointsDialog.userId,
    delta: pointsDialog.delta,
    remark: pointsDialog.remark
  });
  if (res.code === 0) {
    ElMessage.success("积分调整成功");
    pointsDialog.visible = false;
    fetchData();
  } else {
    ElMessage.error((res as any).msg || "操作失败");
  }
}

async function handleVipChange(row: any, val: boolean) {
  const res = await updateUserVip({ userId: row.id, normalVip: val ? 1 : 0 });
  if (res.code === 0) {
    ElMessage.success(val ? "已开启 VIP" : "已关闭 VIP");
    fetchData();
  } else {
    ElMessage.error((res as any).msg || "操作失败");
  }
}

async function handleStatusChange(row: any) {
  const isBanning = row.subscribeStatus === 0;
  await ElMessageBox.confirm(
    isBanning
      ? `确定封禁用户「${row.nickName}」吗？`
      : `确定启用用户「${row.nickName}」吗？`,
    "提示",
    { type: "warning" }
  );
  const res = await updateUserStatus({
    userId: row.id,
    subscribeStatus: isBanning ? 1 : 0
  });
  if (res.code === 0) {
    ElMessage.success(isBanning ? "已封禁" : "已启用");
    fetchData();
  } else {
    ElMessage.error((res as any).msg || "操作失败");
  }
}

onMounted(fetchData);
</script>

<template>
  <div class="main">
    <!-- 搜索栏 -->
    <el-form
      :model="form"
      inline
      class="search-form bg-bg_color w-[99/100] pl-8 pt-3"
    >
      <el-form-item label="昵称">
        <el-input
          v-model="form.nickName"
          placeholder="请输入昵称"
          clearable
          class="w-40!"
        />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          v-model="form.mobile"
          placeholder="请输入手机号"
          clearable
          class="w-40!"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="form.subscribeStatus"
          placeholder="全部"
          clearable
          class="w-30!"
        >
          <el-option label="正常" :value="0" />
          <el-option label="封禁" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="dataList"
      row-key="id"
      stripe
      class="mt-4"
    >
      <el-table-column label="头像" width="70" align="center">
        <template #default="{ row }">
          <el-avatar :size="36" :src="row.avatar" />
        </template>
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="昵称"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column prop="mobile" label="手机号" width="130" />
      <el-table-column
        prop="readArticlePoints"
        label="总充值积分"
        width="110"
        align="right"
      />
      <el-table-column
        prop="readSpendPoints"
        label="总消耗积分"
        width="110"
        align="right"
      />
      <el-table-column
        prop="balance"
        label="余额积分"
        width="100"
        align="right"
      >
        <template #default="{ row }">
          <span :class="row.balance < 0 ? 'text-red-500' : ''">{{
            row.balance
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VIP" width="80" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.normalVip === 1"
            @change="(val: boolean) => handleVipChange(row, val)"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.subscribeStatus === 0 ? 'success' : 'danger'">
            {{ row.subscribeStatus === 0 ? "正常" : "封禁" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="160" align="center">
        <template #default="{ row }">
          {{
            row.createTime
              ? new Date(row.createTime).toLocaleString("zh-CN")
              : "-"
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openPointsDialog(row)"
            >调整积分</el-button
          >
          <el-button
            size="small"
            :type="row.subscribeStatus === 0 ? 'danger' : 'success'"
            @click="handleStatusChange(row)"
          >
            {{ row.subscribeStatus === 0 ? "封禁" : "启用" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      class="mt-4 justify-end"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @size-change="fetchData"
      @current-change="fetchData"
    />

    <!-- 积分调整弹窗 -->
    <el-dialog v-model="pointsDialog.visible" title="调整积分" width="400px">
      <el-form label-width="80px">
        <el-form-item label="积分变化">
          <el-input-number
            v-model="pointsDialog.delta"
            :min="-999999"
            :max="999999"
            placeholder="正数增加，负数扣减"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="pointsDialog.remark" placeholder="可选备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pointsDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="confirmPoints">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
