<template>
  <el-form
    :model="form"
    label-width="150px"
    :rules="rules"
    ref="ruleFormRef"
    style="width: 500px"
  >
    <el-form-item label="要发送的消息类型" prop="type">
      <el-radio-group v-model="form.type">
        <el-radio :label="0" size="large">文本消息</el-radio>
        <el-radio :label="1" size="large">卡片消息</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="form.type === 0" label="输入文本" prop="message">
      <el-input v-model="form.message" placeholder="输入文本内容，支持md语法">
      </el-input>
    </el-form-item>
    <el-form-item v-if="form.type === 1" label="标题" prop="title">
      <el-input v-model="form.title" placeholder="标题，支持md语法"> </el-input>
    </el-form-item>
    <el-form-item v-if="form.type === 1" label="内容" prop="text">
      <el-input v-model="form.text" placeholder="内容，支持md语法"> </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(ruleFormRef)">发送</el-button>
      <nuxt-link to="/login" style="margin-left: 10px"
        >若未登录，请先登录</nuxt-link
      >
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
/**表单内容类型 */
interface formType {
  type: number;
  message?: string;
  title?: string;
  text?: string;
}
/**表单ref，用于表单值校验 */
const ruleFormRef = ref<FormInstance>();
/**表单内容收集 */
const form = reactive<formType>({
  type: 0,
});
/**表单校验规则 */
const rules = reactive<FormRules>({
  type: [{ required: true, message: "请输入内容", trigger: "blur" }],
  message: [{ required: true, message: "请输入内容", trigger: "blur" }],
  title: [{ required: true, message: "请输入内容", trigger: "blur" }],
  text: [{ required: true, message: "请输入内容", trigger: "blur" }],
});
/**点击提交按钮 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let token = localStorage.getItem("token") as string;
      if (!token) {
        ElMessage({
          message: "请先登录",
          type: "error",
        });
        const router = useRouter();
        router.push({ path: "/login" });
        return;
      }
      const { data } = await useFetch(`/api/sendMsg?type=${form.type}`, {
        method: "post",
        body: { ...form },
        headers: {
          Authorization: token,
        },
      });
      console.log(data.value);
      if (data.value?.success === true) {
        ElMessage({
          message: "发送成功",
          type: "success",
        });
      } else {
        ElMessage({
          message: data.value?.message || "发送失败",
          type: "error",
        });
      }
    }
  });
};
</script>

<style>
</style>