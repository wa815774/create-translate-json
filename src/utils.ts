// 复制文本
export const copyTextToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // 使 textarea 不可见  
  textArea.style.position = "fixed";
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = '0';
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? '成功' : '失败';
    console.log('复制命令' + msg);
  } catch (err) {
    console.error('无法复制文本: ', err);
  }

  document.body.removeChild(textArea);
}

/**
 * 删除转义字符
 * @param str 
 * @returns 
 */
export const removeSpecialChars = (str: string, retainLineThrough = false): string => {
  const specialCharacters = retainLineThrough ? /[\/\\^$*+?,():|[\]{}"]/g : /[-\/\\^$*+?,():|[\]{}"]/g;
  const result = str?.replace(specialCharacters, "");
  return result;
}


/**
 * 去除多余的回车
 * @param input 
 * @returns 
 */
export function removeExtraLineBreaks(input: string): string {
  // return input?.replace(/(\r\n|\n|\r)+/g, '\n');
  return input?.replace(/\s+/g, '');
}


/**
 * 转换为每个单词都以“-”来分割
 * @param str 
 * @returns 
 */
export function splitWithLineThrough(str: string) {
  if (!str) return ''
  str = str.replace(/\s+/g, '-');
  // return str[0].toUpperCase() + str.slice(1)
  return str
}