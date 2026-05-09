<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { deviceDetection } from "@pureadmin/utils";
import { getMine, updateMine, changePassword } from "@/api/user";
import type { FormInstance, FormRules } from "element-plus";

defineOptions({
  name: "AccountManagement"
});

const userPhone = ref("");
const userEmail = ref("");

// 修改密码
const pwdVisible = ref(false);
const pwdFormRef = ref<FormInstance>();
const pwdForm = reactive({ oldPwd: "", newPwd: "", confirmPwd: "" });
const pwdRules = reactive<FormRules>({
  oldPwd: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPwd: [
    { required: true, min: 6, message: "新密码不少于6位", trigger: "blur" }
  ],
  confirmPwd: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (_, val, cb) =>
        val !== pwdForm.newPwd ? cb(new Error("两次密码不一致")) : cb(),
      trigger: "blur"
    }
  ]
});

async function submitPwd() {
  await pwdFormRef.value.validate(async valid => {
    if (!valid) return;
    const { code, msg } = await changePassword({
      oldPwd: pwdForm.oldPwd,
      newPwd: pwdForm.newPwd
    });
    if (code === 0) {
      message("密码修改成功", { type: "success" });
      pwdVisible.value = false;
      Object.assign(pwdForm, { oldPwd: "", newPwd: "", confirmPwd: "" });
    } else {
      message(msg || "修改失败", { type: "error" });
    }
  });
}

// 修改手机
const phoneVisible = ref(false);
const phoneFormRef = ref<FormInstance>();
const phoneForm = reactive({ phone: "" });
const phoneRules = reactive<FormRules>({
  phone: [
    {
      required: true,
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur"
    }
  ]
});

async function submitPhone() {
  await phoneFormRef.value.validate(async valid => {
    if (!valid) return;
    const { code } = await updateMine({ phone: phoneForm.phone });
    if (code === 0) {
      userPhone.value = phoneForm.phone;
      message("手机号更新成功", { type: "success" });
      phoneVisible.value = false;
    }
  });
}

// 修改邮箱
const emailVisible = ref(false);
const emailFormRef = ref<FormInstance>();
const emailForm = reactive({ email: "" });
const emailRules = reactive<FormRules>({
  email: [
    {
      required: true,
      type: "email",
      message: "请输入正确的邮箱",
      trigger: "blur"
    }
  ]
});

async function submitEmail() {
  await emailFormRef.value.validate(async valid => {
    if (!valid) return;
    const { code } = await updateMine({ email: emailForm.email });
    if (code === 0) {
      userEmail.value = emailForm.email;
      message("邮箱更新成功", { type: "success" });
      emailVisible.value = false;
    }
  });
}

function maskPhone(phone: string) {
  return phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "未绑定";
}

function maskEmail(email: string) {
  if (!email) return "未绑定";
  const [name, domain] = email.split("@");
  return name.substring(0, 3) + "***@" + domain;
}

onMounted(async () => {
  const { code, data } = await getMine();
  if (code === 0) {
    userPhone.value = data.phone || "";
    userEmail.value = data.email || "";
  }
});
</script>

<template>
  <div :class="['min-w-45', deviceDetection() ? 'max-w-full' : 'max-w-[70%]']">
    <h3 class="my-8!">账户管理</h3>

    <!-- 账户密码 -->
    <div class="flex items-center">
      <div class="flex-1">
        <p>账户密码</p>
        <el-text class="mx-1" type="info">修改后需重新登录</el-text>
      </div>
      <el-button type="primary" text @click="pwdVisible = true">修改</el-button>
    </div>
    <el-divider />

    <!-- 密保手机 -->
    <div class="flex items-center">
      <div class="flex-1">
        <p>密保手机</p>
        <el-text class="mx-1" type="info">
          {{ userPhone ? `已绑定手机：${maskPhone(userPhone)}` : "未绑定手机" }}
        </el-text>
      </div>
      <el-button
        type="primary"
        text
        @click="
          () => {
            phoneForm.phone = userPhone;
            phoneVisible = true;
          }
        "
        >修改</el-button
      >
    </div>
    <el-divider />

    <!-- 备用邮箱 -->
    <div class="flex items-center">
      <div class="flex-1">
        <p>备用邮箱</p>
        <el-text class="mx-1" type="info">
          {{ userEmail ? `已绑定邮箱：${maskEmail(userEmail)}` : "未绑定邮箱" }}
        </el-text>
      </div>
      <el-button
        type="primary"
        text
        @click="
          () => {
            emailForm.email = userEmail;
            emailVisible = true;
          }
        "
        >修改</el-button
      >
    </div>
    <el-divider />

    <!-- 修改密码弹窗 -->
    <el-dialog
      v-model="pwdVisible"
      title="修改密码"
      width="400px"
      destroy-on-close
    >
      <el-form
        ref="pwdFormRef"
        :model="pwdForm"
        :rules="pwdRules"
        label-width="80px"
      >
        <el-form-item label="原密码" prop="oldPwd">
          <el-input
            v-model="pwdForm.oldPwd"
            type="password"
            show-password
            placeholder="请输入原密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input
            v-model="pwdForm.newPwd"
            type="password"
            show-password
            placeholder="请输入新密码（不少于6位）"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input
            v-model="pwdForm.confirmPwd"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPwd">确定</el-button>
      </template>
    </el-dialog>

    <!-- 修改手机弹窗 -->
    <el-dialog
      v-model="phoneVisible"
      title="修改手机号"
      width="400px"
      destroy-on-close
    >
      <el-form
        ref="phoneFormRef"
        :model="phoneForm"
        :rules="phoneRules"
        label-width="80px"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="phoneForm.phone" placeholder="请输入新手机号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="phoneVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPhone">确定</el-button>
      </template>
    </el-dialog>

    <!-- 修改邮箱弹窗 -->
    <el-dialog
      v-model="emailVisible"
      title="修改邮箱"
      width="400px"
      destroy-on-close
    >
      <el-form
        ref="emailFormRef"
        :model="emailForm"
        :rules="emailRules"
        label-width="80px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="emailForm.email" placeholder="请输入新邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="emailVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEmail">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.el-divider--horizontal {
  border-top: 0.1px var(--el-border-color) var(--el-border-style);
}
</style>
