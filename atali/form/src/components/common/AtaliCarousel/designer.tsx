
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliCarouselSchema } from './schema'
import { AtaliCarouselLocales } from './locales'
import { Carousel } from 'antd'
import './index.less'
import { useField } from '@formily/react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'



export const AtaliCarousel: DnFC<any> = (props) => {
    const field = useField()
    const contentStyle: any = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };
    const { styleHeight } = props
    if (styleHeight) {
        contentStyle.height = styleHeight
        contentStyle.lineHeight = styleHeight
    }
    return (
        <Carousel {...props} arrows={true} className='bottomright'
            appendDots={dots => (
                <div
                >
                    <ul style={{ margin: "0px" }}> {dots} </ul>
                </div>
            )}
            customPaging={
                i => (
                    <div
                        style={{
                            width: "30px",
                            color: "blue",
                            border: "1px blue solid"
                        }}
                    >
                        {i + 1}
                    </div>
                )
            }
            dots={{
                className: "customer-slick-dots",
            }} prevArrow={<LeftOutlined className='bottomright' />} nextArrow={<RightOutlined />}>
            {/* @ts-ignore */}
            {field.dataSource?.map(item => {
                return <div >
                    <div style={contentStyle}>
                        <figure className='carousel-title' style={{ height: contentStyle.height }}>
                            <img height={contentStyle.height} src={item.image} />
                            <figcaption>{item.title}</figcaption>
                        </figure>
                    </div>
                </div>
            })}
        </Carousel>
    )
}

AtaliCarousel.Behavior = createBehavior({
    name: 'AtaliCarousel',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliCarousel',
    designerProps: {
        propsSchema: createVoidFieldSchema(AtaliCarouselSchema),
    },
    designerLocales: AtaliCarouselLocales,
})

AtaliCarousel.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                'x-decorator': 'FormItem',
                'x-component': 'AtaliCarousel',
                'x-component-props': {
                    title: '走马灯',
                    content: '提示内容',
                    trigger: 'hover',
                    placement: 'right'
                },
                enum: [
                    { "title": "标题1", "image": "https://toutiao.xzdw.gov.cn/tpxw/202304/W020230404377240183082.JPG" },
                    { "title": "标题2", "image": "https://toutiao.xzdw.gov.cn/tpxw/202304/W020230404377240183082.JPG" },
                    { "title": "标题3", "image": "https://toutiao.xzdw.gov.cn/tpxw/202304/W020230404377240183082.JPG" },
                    { "title": "标题4", "image": "https://toutiao.xzdw.gov.cn/tpxw/202304/W020230404377240183082.JPG" }
                ]
            }
        }
    ]
})

