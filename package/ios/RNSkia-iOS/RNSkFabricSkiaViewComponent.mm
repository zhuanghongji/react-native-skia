#import "RNSkFabricSkiaViewComponent.h"

#import <react/renderer/components/rnskia/EventEmitters.h>
#import <react/renderer/components/rnskia/Props.h>
#import <react/renderer/components/rnskia/RCTComponentViewHelpers.h>
#import <react/renderer/components/rnskia/ComponentDescriptors.h>
#import <react/renderer/components/rnskia/ShadowNodes.h>

#import "RCTConversions.h"
#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RNSkFabricSkiaViewComponent () <RCTReactNativeSkiaViewViewProtocol>
@end

@implementation RNSkFabricSkiaViewComponent {
  ReactNativeSkiaViewShadowNode::ConcreteState::Shared _state;  
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ReactNativeSkiaViewProps>();
    _props = defaultProps;
  }

  return self;
}

- (void)didMoveToWindow
{
  [self updateStateIfNecessary];  
}

- (void)updateStateIfNecessary
{
  [self updateState];
}

- (void)updateState
{
  if (!_state) {
    return;
  }

  _state->updateState(
      [=](ReactNativeSkiaViewShadowNode::ConcreteState::Data const &oldData)
          -> ReactNativeSkiaViewShadowNode::ConcreteState::SharedData {
        auto newData = oldData;
        return std::make_shared<ReactNativeSkiaViewShadowNode::ConcreteState::Data const>(newData);
      });
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<ReactNativeSkiaViewComponentDescriptor>();
}

- (void)updateState:(State::Shared const &)state oldState:(State::Shared const &)oldState
{
  _state = std::static_pointer_cast<ReactNativeSkiaViewShadowNode::ConcreteState const>(state);
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  [super finalizeUpdates:updateMask];
  [self updateStateIfNecessary];
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];

  [NSNotificationCenter.defaultCenter removeObserver:self];
  _state.reset();
}

@end

Class<RCTComponentViewProtocol> ReactNativeSkiaViewCls(void)
{
  return RNSkFabricSkiaViewComponent.class;
}
