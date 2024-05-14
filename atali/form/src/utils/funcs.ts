import { RecursiveCall, getToken, getTenantID, getUserInfo } from '@swiftease/atali-pkg';
import moment from 'moment';
import { defaultService } from './http';

/**
 * This function takes two arrays, `srcData` and `dstData`, and compares each element in `srcData` to every element in `dstData`. If the comparison function returns true, the element from `dstData` is added to a temporary array called `temp`. Otherwise, the element from `srcData` is used to create a new element using the `newData` function and added to `temp`. Finally, the `dstData` array is updated with the elements in `temp`.
 *
 * @param values - An object containing the data for the two arrays.
 * @param field1 - The name of the field in `values` that contains the `srcData` array.
 * @param field2 - The name of the field in `values` that contains the `dstData` array.
 * @param compare - A function that takes two elements from the `srcData` and `dstData` arrays and returns true if they are equal.
 * @param newData - A function that takes an element from the `srcData` array and creates a new element to be added to the `dstData` array.
 */
export function submitBeforeConvertArrayData(values: any, field1: string, field2: string, compare: (data1: any, data2: any) => boolean, newData: (values: any, field1Data: any) => any) {
    const srcData = values[field1]
    if (!srcData || srcData.length == 0) {
        values[field2] = []
        return
    }
    let dstData = values[field2]
    if (!dstData || !dstData.forEach) dstData = []
    const temp: any[] = []
    //找出新增的
    srcData.forEach((field1Data: any) => {
        let tempTag = undefined
        dstData.forEach((field2Data: any) => {
            if (compare(field1Data, field2Data)) {
                tempTag = field2Data
                return false
            }
            return
        })
        if (tempTag) {
            temp.push(tempTag)
        } else {
            temp.push(newData(values, field1Data))
        }
    })
    values[field2] = temp
}

/**
 * Removes any data from `dstData` that is not present in `srcData` using the provided comparison function. It also calls the `removeFn` function for each removed data item.
 * @param {any[]} srcData - The source data array.
 * @param {any[]} dstData - The destination data array.
 * @param {function(data1: any, data2: any): boolean} compare - The comparison function to use for determining if two data items are the same.
 * @param {function(field1Data: any): any} newData - The function to call to create a new data item if it is not found in `dstData`.
 * @param {function(data2: any): void} removeFn - The function to call for each removed data item.
 * @returns {any[]} The updated destination data array.
 */
export function removeAdd(srcData: any[], dstData: any[], compare: (data1: any, data2: any) => boolean, newData: (field1Data: any) => any, removeFn: (data2: any) => void) {
    if (!srcData || srcData.length == 0) {
        return []
    }

    if (!dstData || !dstData.forEach) dstData = []
    const temp: any[] = []
    //找出新增的
    srcData.forEach((field1Data: any) => {
        let tempData = undefined
        dstData.forEach((field2Data: any) => {
            if (compare(field1Data, field2Data)) {
                tempData = field2Data
                return false
            }
            return
        })
        if (tempData) {
            temp.push(tempData)
        } else {
            temp.push(newData(field1Data))
        }
    })

    dstData.forEach((field2Data: any) => {
        let found = false
        srcData.forEach((field1Data: any) => {
            if (compare(field1Data, field2Data)) {
                found = true
                return false
            }
            return
        })
        if (!found) {
            removeFn(field2Data)
        }
    })
    return temp
}

/**
 * 转换树形数据并添加 key、value、label 和 title 属性
 * 原方法名称: convertTreeData
 * @param $self - 当前组件的实例
 * @param url - 数据请求的 URL
 */
export async function convertAndEnhanceTreeData($self: any, url: string) {
    // 设置请求头
    const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${getToken()}`,
    };

    /**
     * 递归遍历树形数据并应用回调函数
     * @param data - 树形数据数组
     * @param callback - 应用于每个数据项的回调函数
     */
    const traverseTreeDataRecursively = (data: any[], callback: (item: any) => void) => {
        data.forEach((item) => {
            callback(item);
            if (item.children) {
                traverseTreeDataRecursively(item.children, callback);
            }
        });
    };

    try {
        $self.loading = true;
        const response = await fetch(url, { headers });
        const { data } = await response.json();

        if (Array.isArray(data)) {
            traverseTreeDataRecursively(data, (item: any) => {
                item.key = item.id;
                item.value = item.value || item.id;
                item.label = item.title || item.name;
                item.title = item.title || item.name;
            });
        }

        $self.dataSource = data ?? [];
    } catch {
        $self.dataSource = [];
    } finally {
        $self.loading = false;
    }
}



/**
 * 转换树形数据并根据提供的函数自定义 value 和 label 属性
 * 原方法名称: convertTreeDataLableAndValue
 * @param $self - 当前组件的实例
 * @param url - 数据请求的 URL
 * @param valueFn - 根据 item 计算 value 的函数
 * @param labelFn - 根据 item 计算 label 的函数
 * @param success - 成功回调函数，可选
 *
 * 使用示例：
 * convertAndCustomizeTreeDataLabelsAndValues($self, 'https://api.example.com/data', item => item.id, item => item.name, data => console.log(data));
 */
export async function convertAndCustomizeTreeDataLabelsAndValues($self: any, url: string, valueFn: (item: any) => any, labelFn: (item: any) => string, success?: (data: any[]) => void) {
    // 设置请求头
    const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${getToken()}`,
    };

    // 递归遍历树形数据并应用回调函数
    const traverseTreeDataRecursively = (data: any[], callback: (item: any) => void) => {
        data.forEach((item) => {
            callback(item);
            if (item.children) {
                traverseTreeDataRecursively(item.children, callback);
            }
        });
    };

    try {
        $self.loading = true;
        const response = await fetch(url, { headers });
        const { data } = await response.json();

        if (Array.isArray(data)) {
            traverseTreeDataRecursively(data, (item: any) => {
                const value = valueFn(item);
                item.key = value;
                item.value = value;

                const label = labelFn(item);
                item.label = label;
                item.title = label;
            });
        }

        success && success(data);
        $self.dataSource = data ?? [];
    } catch {
        $self.dataSource = [];
    } finally {
        $self.loading = false;
    }
}


/**
 * 将数据转换为树形结构，并为每个节点设置 key、value 和 label 属性。
 * @param $self - 当前组件的实例
 * @param data - 需要转换的数据数组
 */
export function convertDataToTree($self: any, data: any) {
    if (data && data.forEach) {
        RecursiveCall(data, (item: any) => {
            item["key"] = item.id
            if (!item["value"]) {
                item["value"] = item.id
            }
            if (item["title"]) {
                item["lable"] = item["title"]
            } else {
                item["lable"] = item.name
                item["title"] = item.name as string
            }
        })
    }
    $self.dataSource = data ?? []
}

/**
 * 将数据转换为树形结构，并为每个节点设置 key、value 和 label 属性。
 * @param $self - 当前组件的实例
 * @param data - 需要转换的数据数组
 */
export function convertDataToTree2($self: any, data: any) {
    if (data && data.forEach) {
        RecursiveCall(data, (item: any) => {
            item["key"] = item.id
            if (!item["value"]) {
                item["value"] = item.id
            }
            if (item["title"]) {
                item["lable"] = item["title"]
            } else {
                item["lable"] = item.name
                item["title"] = item.name as string
            }
        })
    }
    $self.setValue({ dataSource: data ?? [] })
}

/**
 * 将 tags 字段转换为标签数组。
 * @param $deps - 当前组件的依赖项对象
 * @param $self - 当前组件的实例
 * @param tagsField - 需要转换的 tags 字段名
 * @param tagNameField - 标签名称字段名
 */
export function convertTags($deps: any, $self: any, tagsField: string, tagNameField: string) {
    if ($deps.id == "") {
        $self.value = []
        return
    }
    const oldTags = $self.query(tagsField).value()
    if (!oldTags || !oldTags.forEach) {
        $self.value = []
        return
    }
    const tags: any[] = []
    oldTags.forEach((tag: any) => {
        tags.push(tag[tagNameField])
    })
    $self.value = tags
}


/**
 * 将 url 获取的数据转换为 Select 组件所需的格式。
 * @param $self - 当前组件的实例
 * @param url - 数据来源的 URL
 * @param labelFieldName - 需要转换的 label 字段名
 * @param sucess - 成功获取数据后的回调函数，接受转换后的数组和原始响应对象作为参数
 */
export function convertSelectData($self: any, url: string, labelFieldName: string, success?: (temp: any[], res?: any) => {}) {
    convertSelectDataLabel($self, url, (item: any) => {
        return item[labelFieldName]
    }, success)
}

/**
 * 将 url 获取的数据转换为 Select 组件所需的格式，同时为每个项设置 value 字段。
 * @param $self - 当前组件的实例
 * @param url - 数据来源的 URL
 * @param valueFn - 定义每个项 value 属性的函数
 * @param labelFieldName - 需要转换的 label 字段名
 * @param sucess - 成功获取数据后的回调函数，接受转换后的数组和原始响应对象作为参数
 */
export function convertSelectDataLabel($self: any, url: string, labelFn: (item: any) => string, sucess?: (temp: any[], res?: any) => {}) {
    transformSelectDataLabelAndValue($self, url, (item: any) => {
        return item.id
    }, labelFn, sucess)
}

/**
 * 转换选择数据的标签和值
 * 原方法名称: convertSelectDataLableAndValue
 * @param $self - 当前组件的实例
 * @param url - 数据请求的 URL
 * @param valueFn - 根据 item 计算 value 的函数
 * @param labelFn - 根据 item 计算 label 的函数
 * @param success - 成功回调函数，可选
 *
 * 使用例子:
 * transformSelectDataLabelAndValue(this, '/api/data', item => item.id, item => item.name, (temp, res) => {
 *   console.log('转换后的数据:', temp);
 * });
 */
export function transformSelectDataLabelAndValue($self: any, url: string, valueFn: (item: any) => any, labelFn: (item: any) => string, success?: (temp: any[], res?: any) => {}) {
    transformToSelectDataSource($self, url, valueFn, labelFn, success);
}

/**
 * 转换为选择器数据源
 * 原方法名称: convertToSelectDataSource
 * @param $self - 当前组件的实例
 * @param url - 数据请求的 URL
 * @param valueFn - 根据 item 计算 value 的函数
 * @param labelFn - 根据 item 计算 label 的函数
 * @param success - 成功回调函数，可选
 * @param getData - 获取数据的函数，可选
 */
export function transformToSelectDataSource($self: any, url: string, valueFn: (item: any) => any, labelFn: (item: any) => string, success?: (temp: any[], res?: any) => {}, getData?: (obj: any) => any) {
    $self.loading = true;
    fetch(url, {
        headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + getToken(),
        },
    })
        .then((response) => response.json())
        .then(
            (res) => {
                $self.loading = false;
                const { data } = res;
                let dataSource: any;
                if (getData) {
                    dataSource = getData(data);
                } else {
                    dataSource = data;
                }
                const temp: any[] = [];
                if (dataSource && dataSource.forEach) {
                    dataSource?.forEach((r: any) => {
                        temp.push({
                            ...r,
                            value: valueFn(r),
                            label: labelFn(r),
                        });
                    });
                }

                if (success)
                    success(temp, res);
                // else {
                //     let found = false
                //     temp?.forEach(item => {
                //         if (item.value === $self.value) {
                //             found = true
                //             return false
                //         }
                //         return true
                //     })
                //     if (!temp || temp.length === 0 || !found) {
                //         $self.setValue(null)
                //     }
                // }
                $self.dataSource = temp;
            },
            () => {
                $self.loading = false;
            }
        );
}

/**
 * 更新选择器组件的值
 * @param $self - 当前组件的实例
 * @param temp - 选择器的选项数据源
 */
export function updateSelectValue($self: any, temp: any[]) {
    let found = false
    temp?.forEach(item => {
        if (item.value === $self.value) {
            found = true
            return false
        }
        return true
    })
    if (!temp || temp.length === 0 || !found) {
        $self.setValue(null)
    }
}

/**
 * 将文件数据转换为新的格式
 * @param $deps - 依赖对象，包含 getToken 函数和 convertFiles 方法
 * @param $self - 当前组件的实例
 * @param filesFieldName - 文件字段的名称
 * @param urlPrefix - 文件下载 URL 前缀，可选
 */
export function convertFilesData($deps: any, $self: any, filesFieldName: string, urlPrefix?: string) {
    convertFiles($deps, $self, filesFieldName, 'fileID', 'fileName', 'type', urlPrefix)
}

/**
 * 将文件数组转换为新的格式
 * @param $deps - 依赖对象，包含 getToken 函数和 convertFiles 方法
 * @param $self - 当前组件的实例
 * @param filesFieldName - 文件字段的名称
 * @param fileIDField - 文件 ID 字段名
 * @param fileNameField - 文件名称字段名
 * @param fileTypeField - 文件类型字段名
 * @param urlPrefix - 文件下载 URL 前缀，可选
 */
export function convertFiles($deps: any, $self: any, filesFieldName: string, fileIDField: string, fileNameField: string, fileTypeField: string, urlPrefix?: string) {
    if ($deps.id == "") return
    const oldFiles = $self.form.values[filesFieldName]
    if (!oldFiles || !oldFiles.forEach) {
        $self.value = []
        return
    }
    const newFiles: any[] = []
    oldFiles.forEach((oldFile: any) => {
        newFiles.push(createFile(oldFile, fileIDField, fileNameField, fileTypeField, urlPrefix))
    })
    $self.value = newFiles
}

/**
 * 将文件数据转换为新的格式
 * @param $self - 当前组件的实例
 * @param oldFile - 原始文件对象
 * @param urlPrefix - 文件下载 URL 前缀，可选
 */
export function convertFileData($self: any, oldFile: any, urlPrefix?: string) {
    convertFile($self, oldFile, 'fileID', 'fileName', 'type', urlPrefix)
}

/**
 * 将单个文件对象转换为新的格式
 * @param $self - 当前组件的实例
 * @param obj - 原始文件对象
 * @param fileIDField - 文件 ID 字段名
 * @param fileNameField - 文件名称字段名
 * @param fileTypeField - 文件类型字段名
 * @param urlPrefix - 文件下载 URL 前缀，可选
 */
export function convertFile($self: any, obj: any, fileIDField: string, fileNameField: string, fileTypeField: string, urlPrefix?: string) {
    if (!obj || !obj[fileIDField] || obj[fileIDField] === '') {
        $self.value = []
        return
    }

    const newFiles: any[] = [
        createFile(obj, fileIDField, fileNameField, fileTypeField, urlPrefix)
    ]
    $self.value = newFiles
}

/**
 * 创建一个文件对象，包含response、url、type和name字段
 * @param obj - 原始文件对象
 * @param fileIDField - 文件 ID 字段名
 * @param fileNameField - 文件名称字段名，可选
 * @param fileTypeField - 文件类型字段名，可选
 * @param urlPrefix - 文件下载 URL 前缀，可选
 */
export function createFile(obj: any, fileIDField: string, fileNameField?: string, fileTypeField?: string, urlPrefix?: string) {
    return {
        response: {
            fileID: obj[fileIDField],
        },
        url: (urlPrefix ?? "/api/core/file/download") + ("?id=" + obj[fileIDField]),
        type: fileTypeField && fileTypeField !== '' ? obj[fileTypeField] : undefined,
        name: fileNameField && fileNameField !== '' ? obj[fileNameField] : undefined
    }
}

/**
 * 将新文件与旧文件比对，找出新增的文件并进行处理
 * @param values - 表单数据
 * @param field1 - 新文件字段名
 * @param field2 - 旧文件字段名
 * @param compare - 文件对比函数，用于比较新文件和旧文件是否相同
 * @param newData - 处理新增文件的函数，用于将新文件转换为新的格式
 */
export function submitBeforeConvertFilesData(values: any, field1: string, field2: string, compare: (data1: any, data2: any) => boolean, newData: (values: any, field1Data: any) => any) {
    const newFiles = values[field1]
    if (!newFiles || newFiles.length == 0) {
        values[field2] = []
        return
    }
    let oldFiles = values[field2] || [] // 确保旧文件数组存在，并进行初始化处理，避免出现错误的类型断言错误信息提示。  type-error: Argument of type 'undefined' is not assignable to parameter of type 'any[]'.ts(2345)
    const tempFiles: any[] = []
    //找出新增的
    newFiles.forEach((file: any) => {
        let tempFile = undefined
        oldFiles.forEach((oldFile: any) => {
            if (compare(file, oldFile)) {
                tempFile = oldFile
                return false
            }
            return
        })
        if (tempFile) {
            tempFiles.push(tempFile)
        } else {
            tempFiles.push(newData(values, file))
        }
    })
    values[field2] = tempFiles
}

export function submitBeforeConvertFileData(values: any, fromFileField: string) {
    fileToValue(values, fromFileField, 'fileID', 'fileName', 'type', 'size')
}

//将文件转换为值
//原方法名称: convertFileToValue
// @param values - 表单值
// @param fromFileField - 文件字段
// @param fileIDField - 文件ID字段
// @param fileNameField - 文件名字段
// @param fileTypeField - 文件类型字段
// @param fileSizeField - 文件大小字段
export function fileToValue(values: any, fromFileField: string, fileIDField: string, fileNameField?: string, fileTypeField?: string, fileSizeField?: string) {
    const newFiles = values[fromFileField]
    if (!newFiles || newFiles.length == 0) {
        values[fileIDField] = ''
        if (fileNameField && fileNameField != "") {
            values[fileNameField] = ''
        }
        if (fileNameField && fileNameField != "") {
            values[fileNameField] = ''
        }
        if (fileSizeField && fileSizeField != "") {
            values[fileSizeField] = 0
        }
        return
    }
    const newFile = newFiles[0]
    values[fileIDField] = newFile.response?.fileID
    if (fileNameField && fileNameField != "") {
        values[fileNameField] = newFile.name
    }
    if (fileTypeField && fileTypeField != "") {
        values[fileTypeField] = newFile.type
    }
    if (fileSizeField && fileSizeField != "") {
        values[fileSizeField] = newFile.size
    }
}

//将文件转换为值
// @param values - 表单值
// @param fromFileField - 文件字段
// @param toFileField - 文件值字段
// @param fileIDField - 文件ID字段
// @param fileNameField - 文件名字段
// @param fileTypeField - 文件类型字段
// @param fileSizeField - 文件大小字段
export function filesToValue(values: any, fromFileField: string, toFileField: string, fileIDField: string, fileNameField?: string, fileTypeField?: string, fileSizeField?: string) {
    const newFiles = values[fromFileField]
    if (!newFiles || newFiles.length == 0) {
        values[toFileField] = []
        return
    }
    const result: {}[] = []
    newFiles.forEach((newFile: any) => {
        const file = {}
        file[fileIDField] = newFile.response?.fileID
        if (fileNameField && fileNameField != "") {
            file[fileNameField] = newFile.name
        }
        if (fileTypeField && fileTypeField != "") {
            file[fileTypeField] = newFile.type
        }
        if (fileSizeField && fileSizeField != "") {
            file[fileSizeField] = newFile.size
        }
        result.push(file)
    })

    values[toFileField] = result
}

/** 将级联选择器值转换为数组，并设置idField和parentIDsField的值。
 * 
 * @param values 表单值。
 * @param idField 要设置的ID字段。
 * @param idsField 级联选择器的值字段。
 * @param parentIDsField 要设置的父级ID字段。
 * @returns undefined
 */
export function submitBeforeConvertCascaderData(values: any, idField: string, idsField: string, parentIDsField: string) {
    const ids = values[idsField]
    if (!ids || ids.length == 0) {
        values[idField] = 0
        values[parentIDsField] = ''
        return
    }
    values[idField] = ids[ids.length - 1]
    values[parentIDsField] = '/' + ids.slice(0, ids.length - 1).join("/") + '/'
}

/** 将级联选择器值转换为数组，并设置idField和parentIDsField的值。
 * 此函数接受一个表单值对象，以及三个参数：idField、idsField和parentIDsField。它会提取级联选择器的值，并将其转换为一个数组。它还会设置idField和parentIDsField的值。如果级联选择器的值为空，则设置idField和parentIDsField的值为空。
 * @param values 表单值对象。
 * @param idField 要设置的ID字段。
 * @param idsField 级联选择器的值字段。
 * @param parentIDsField 要设置的父级ID字段。
 * @returns undefined。该函数不会返回任何值。它会修改传入的表单值对象。
 */
export function convertCascaderData($self: any, values: any, idField: string, parentIDsField: string) {
    const ids = []
    const parentIDs = values[parentIDsField]
    if (parentIDs && parentIDs != "") {
        const list = parentIDs.split("/")
        list.forEach((element: String) => {
            if (element != "") {
                ids.push(Number(element))
            }
        });
    }
    const id = values[idField]
    if (id && id != 0) {
        ids.push(id)
    }
    $self.value = ids
}

/** Converts a timestamp to a string using the specified format. The default format is "YYYY-MM-DD HH:mm".
 *
 * @param value The timestamp to convert.
 * @param format The format to use for the string. If not provided, the default format will be used.
 * @returns A string representation of the timestamp.
 */
export function timeStampToString(value: any, format?: string) {
    return moment.unix(value).format(format ?? "YYYY-MM-DD HH:mm")
}

/** Converts a timestamp to a string using the specified format. The default format is "YYYY-MM-DD HH:mm".
 * This function takes a timestamp value and an optional format string as input. It returns a string representation of the timestamp in the specified format. If no format is provided, the default format will be used. The `moment` library is used to perform the conversion.
 *
 * @param value The timestamp to convert.
 * @param format The format to use for the string. If not provided, the default format will be used.
 * @returns A string representation of the timestamp.
 */
export function timeStamp2ToString(value: any, format?: string) {
    return moment(value).format(format ?? "YYYY-MM-DD HH:mm")
}

/** This function formats a currency value as a string. It takes a value as input and returns a string with the currency symbol and the value formatted with commas every 3 digits. The default currency symbol is "$". You can specify a custom currency symbol by passing it as an argument.
 *
 * @param value The currency value to format.
 * @param symbol The currency symbol to use. If not provided, the default symbol will be used.
 * @returns A string representation of the currency value.
 */
export function currencyFormatter(value: string | number, symbol?: string) {
    return `${symbol ?? "$"} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/** This function parses a currency value string and returns the numeric value. It removes any currency symbol or commas from the input string before returning the numeric value. The default currency symbol is "$". You can specify a custom currency symbol by passing it as an argument.
 *
 * @param value The currency value string to parse.
 * @param symbol The currency symbol to use. If not provided, the default symbol will be used.
 * @returns The numeric value of the currency string.
 */
export function currencyParse(value: string, symbol?: string) {
    return parseFloat(value!.replace(/\$\s?|(,*)/g, ''))
}

/** 获取当前时间。返回格式为 "YYYY-MM-DD HH:mm:ss" 的字符串。 */
export function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/** 获取当前日期。返回格式为 "YYYY-MM-DD" 的字符串。 */
export function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

window['submitBeforeConvertFilesData'] = submitBeforeConvertFilesData
window['submitBeforeConvertFileData'] = submitBeforeConvertFileData
window['submitBeforeConvertFile'] = fileToValue
window['fileToValue'] = fileToValue
window['filesToValue'] = filesToValue
window['submitBeforeConvertArrayData'] = submitBeforeConvertArrayData
window['submitBeforeConvertCascaderData'] = submitBeforeConvertCascaderData
window['transformSelectDataLabelAndValue']=transformSelectDataLabelAndValue

export function isPlatformTenant(platformTenantID: string) {
    const t = getToken()
    if (!t) return false
    const tenantID = getTenantID(t)
    return tenantID == platformTenantID
}

export const funcs = {
    commonService: defaultService,
    getToken, getTenantID, getUserInfo, isPlatformTenant, currencyFormatter, currencyParse,
    RecursiveCall, submitBeforeConvertArrayData,
    convertTreeData: convertAndEnhanceTreeData, convertAndEnhanceTreeData,
    convertTags, convertSelectData, convertFilesData,
    submitBeforeConvertFileData, convertFileData, convertFile, submitBeforeConvertCascaderData, convertCascaderData, convertSelectDataLabel,
    convertSelectDataLableAndValue: transformSelectDataLabelAndValue, transformSelectDataLabelAndValue,
    convertToSelectDataSource: transformToSelectDataSource, transformToSelectDataSource,
    convertDataToTree, convertDataToTree2,
    convertTreeDataLableAndValue: convertAndCustomizeTreeDataLabelsAndValues, convertAndCustomizeTreeDataLabelsAndValues,
    submitBeforeConvertFile: fileToValue, fileToValue, filesToValue,
    timeStampToString, timeStamp2ToString, convertFiles, updateSelectValue,getCurrentTime,getCurrentDate
}