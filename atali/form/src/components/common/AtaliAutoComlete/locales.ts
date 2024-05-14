export const AtaliAutoCompleteLocales = {
  'zh-CN': {
    title: '自动完成',
    settings: {
      'x-component-props': {
        url:'Url',
        labelField:'标签字段',
        idField:'value 字段',
        allowClear: '支持清除',
        autoFocus: '自动获取焦点',
        backfill: "使用键盘选择选项的时候把选中项回填到输入框中",
        defaultActiveFirstOption: "是否默认高亮第一个选项",
        defaultOpen: '是否默认展开下拉菜单',
        defaultValue: "指定默认选中的条目",
        disabled: "是否禁用",
        popupClassName: '下拉菜单的 className 属性',
        dropdownMatchSelectWidth: '下拉菜单和选择器同宽',
        filterOption: '是否根据输入项进行筛选',
        getPopupContainer: '菜单渲染父节点',
        notFoundContent: '当下拉列表为空时',
        open: '是否展开下拉菜单',
        options: '数据化配置',
        placeholder: '输入框提示',
        status: '设置校验状态',
        value: '指定当前选中的条目',
        onBlur: '失去焦点时的回调',
        onChange: '变化的回调',
        onDropdownVisibleChange: '展开下拉菜单的回调',
        onFocus: '获得焦点时的回调',
        onSearch: '搜索补全项的时候调用',
        onSelect: '被选中时调用',
        onClear: '清除内容时的回调',
      },
    },
    addExtra: '添加操作区域'
  },
  'en-US': {
    title: 'Card',
    settings: {
      'x-component-props': {
        type: 'Type',
        title: 'Title',
        extra: 'Extra',
        cardTypes: [
          { label: 'Inner', value: 'inner' },
          { label: 'Default', value: '' },
        ],
      },
    },
  },
  'ko-KR': {
    title: '카드',
    settings: {
      'x-component-props': {
        type: '타입',
        title: '제목',
        extra: '추가 항목',
        cardTypes: [
          { label: '안쪽', value: 'inner' },
          { label: '기본', value: '' },
        ],
      },
    },
  },
}
