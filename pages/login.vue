<template>
  <el-form
    :model="form"
    label-width="150px"
    :rules="rules"
    ref="ruleFormRef"
    style="width: 500px"
  >
    <el-form-item label="账号" prop="account">
      <el-input v-model="form.account" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(ruleFormRef)">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
/**表单内容类型 */
interface formType {
  account: string;
  password: string;
}
/**表单ref，用于表单值校验 */
const ruleFormRef = ref<FormInstance>();
/**表单内容收集 */
const form = reactive<formType>({
  account: "",
  password: "",
});
/**表单校验规则 */
const rules = reactive<FormRules>({
  account: [{ required: true, message: "请输入内容", trigger: "blur" }],
  password: [{ required: true, message: "请输入内容", trigger: "blur" }],
});
/**点击提交按钮 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const { data } = await useFetch(`/api/login`, {
        method: "post",
        body: { ...form },
      });
      console.log(data.value);
      if (data.value?.success === true) {
        localStorage.setItem("token", data.value?.data as string);
        ElMessage({
          message: "登录成功",
          type: "success",
        });
        const router = useRouter();
        router.push({ path: "/" });
      } else {
        ElMessage({
          message: data.value?.message || "登录失败",
          type: "error",
        });
      }
    }
  });
};
</script>

<style>
</style>